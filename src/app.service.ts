import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { PrismaService } from 'src/database/prisma.service';
import * as fs from 'fs';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  private provider = ethers.getDefaultProvider(process.env.EVM_CHAIN_RPC_URL);
  private wallet = new ethers.Wallet(
    process.env.RUNNER_PRIVATE_KEY,
    this.provider,
  );
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async createUser(body): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        address: body.address,
      },
    });

    if (!user) {
      await this.prisma.user.create({
        data: {
          address: body.address,
          grade: 1,
          tokenId: 9999,
        },
      });
    }
  }

  async getContract() {
    const jsonFile = fs.readFileSync('src/web3/nex.json', 'utf8');
    const jsonData = JSON.parse(jsonFile);
    const contract = new ethers.Contract(
      process.env.GASLESS_NFT_RECIPIENT_CONTRACT_ADDRESS,
      jsonData.abi,
      // this.provider,
      this.wallet,
    );

    return contract;
  }

  async mintNFT(body): Promise<void> {
    try {
      let nonce = this.getRecentNonce();

      const contract = await this.getContract();

      const mint = await contract.mint();
      console.log(mint);
      nonce = mint.nonce + 1;

      const lastTokenId = Number(await contract.getTotalSupply()) - 1;
      console.log('lastTokenId: ', lastTokenId);

      await this.prisma.user.update({
        where: {
          address: body.address,
        },
        data: {
          tokenId: lastTokenId,
        },
      });

      await this.setMetadata(body.address, lastTokenId);

      const result = await contract.safeTransferFrom(
        this.wallet.address,
        body.address,
        lastTokenId,
      );
      nonce = result.nonce + 1;
    } catch (e) {
      console.log(e);
    }
  }

  async callEvent(eventRequest) {
    const contract = await this.getContract();
    let nonce = await this.getRecentNonce();

    const result = await contract.eventPrize(
      eventRequest.address,
      eventRequest.prize,
      { gasPrice: '25000000000', gasLimit: '33967' },
    );
    console.log(result);
    nonce = result.nonce + 1;

    const tokenId = (
      await this.prisma.user.findUnique({
        where: {
          address: eventRequest.address,
        },
      })
    ).tokenId;

    return this.setMetadata(eventRequest.address, tokenId);
  }

  async setMetadata(address, tokenId) {
    const metadata = [
      'QmdbTNfVtBWfzYq54znSQY8M4Lxs1erYzUkBXd2r2c1K8B',
      'QmaLvwnbURubSXoLoNnjjD5kktuHU4FxUqUHhM13fpjsAs',
      'QmSg8ZNZnbMUMx7yVqXkDuv7qJjTMHeCiKgQSSaLoRZaSx',
    ];
    const contract = await this.getContract();
    let nonce = await this.getRecentNonce();

    const grade = (
      await this.prisma.user.findUnique({
        where: {
          address: address,
        },
      })
    ).grade;

    const ipfsUri = 'ipfs://' + `${metadata[grade - 1]}`;

    const setBaseUri = await contract.setBaseURI(tokenId, ipfsUri, {
      nonce: nonce,
    });
    nonce = setBaseUri.nonce + 1;

    console.log(setBaseUri);

    const axiosConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    console.log();

    const externalUri =
      'https://' +
      'gray-shivering-spoonbill-997.mypinata.cloud/' +
      'ipfs/' +
      `${metadata[grade - 1]}`;
    console.log(externalUri);

    const nftJSON = await firstValueFrom(this.httpService.get(externalUri));
    if (grade < 3) {
      await this.prisma.user.update({
        where: {
          address: address,
        },
        data: {
          grade: grade + 1,
        },
      });
    }

    return nftJSON.data.externalUri;
  }

  async getRecentNonce() {
    const nonce = await this.provider.getTransactionCount(
      process.env.RUNNER_ADDRESS,
      'latest',
    );
    return nonce + 1;
  }
}
