import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { ethers, Signer } from 'ethers';
import { PrismaService } from 'src/database/prisma.service';
import fs from 'fs';

@Injectable()
export class AppService {
  private provider = new ethers.JsonRpcProvider(process.env.EVM_CHAIN_RPC_URL);
  private jsonFile = fs.readFileSync('../web3/nex.json', 'utf8');
  private jsonData = JSON.parse(this.jsonFile);
  private contract = new ethers.Contract(
    '0x63f569459170DDbf2fD9F26ed10b27202c2d9Faf',
    jsonData.abi,
    this.provider,
  );

  constructor(private prisma: PrismaService) {}

  async createUser(address: string): Promise<void> {
    await this.prisma.user.create({
      data: {
        address: address,
      },
    });
  }

  async mintNFT(address: string): Promise<void> {
    //Gas relay mining
    exec(
      `cast send \
    --private-key=acd1c67b10ca079d3dada5a0bda75fa51b119cae2266205372541792a2bf7eda \
    --rpc-url=${process.env.EVM_CHAIN_RPC_URL} \
    ${process.env.GASLESS_COUNTER_RECIPIENT_CONTRACT_ADDRESS} \
    "mint()"`,
      (err, stdout, stderr) => {
        if (err) {
          console.log(`exec error: ${err}`);
          return;
        }

        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      },
    );

    // Update metadata
    const lastTokenId = (await this.contract.getTotalSupply()) - 1;
    await this.contract.setBaseURI(
      lastTokenId,
      'ipfs://QmXEyPiccKn1ifXyJQohnRgtanxpvBdwzPbE2na4LvwQx3',
    );

    // Transfer NFT
    const signer = new ethers.Wallet(
      process.env.RUNNER_PRIVATE_KEY,
      this.provider,
    );

    await this.contract.safeTransferFrom(signer.address, address, lastTokenId);
  }

  async callEvent(address: string) {
    this.contract.eventFrize(address);
  }
}
