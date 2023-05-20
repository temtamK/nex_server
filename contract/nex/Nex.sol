// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@opengsn/contracts/src/ERC2771Recipient.sol";

import "./IContractURI.sol";
import "./IProxyRegistry.sol";
import "./INex.sol";

contract Nex is
    Ownable,
    Pausable,
    ERC721,
    IContractURI,
    INex,
    ERC2771Recipient
{
    /// @inheritdoc IContractURI
    string public override contractURI;

    /// @inheritdoc INex
    uint256 public override totalSupply;

    uint256 public balances; //각 계좌의 잔액을 저장하기 위한 매핑 변수 추가

    // OpenSea Proxy Registry address
    // address internal constant OPENSEA_PROXY_REGISTRY =
    //     0xa5409ec958C83C3f309868babACA7c86DCB077c1;

    // Prefix of each tokenURI
    string internal baseURI;

    mapping(uint => string) public metadataURIs;

    constructor(address forwarder) payable ERC721("NEX", "NEX") {
        // _pause();
        _setTrustedForwarder(forwarder);
    }

    function getTotalSupply() public view returns (uint256) {
        return totalSupply;
    }

    /// @inheritdoc INex
    function setBaseURI(
        uint tokenId,
        string memory newBaseURI
    ) external override {
        metadataURIs[tokenId] = newBaseURI;
    }

    /// @inheritdoc INex
    function setContractURI(string memory newContractURI) external override {
        contractURI = newContractURI;
    }

    /// @inheritdoc INex
    function mint() external override whenNotPaused {
        _safeMint(_msgSender(), totalSupply++);
    }

    /// @inheritdoc INex
    function pause() external override onlyOwner {
        _pause();
    }

    /// @inheritdoc INex
    function unpause() external override onlyOwner {
        _unpause();
    }

    /// @inheritdoc IERC165
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, IERC165) returns (bool) {
        return
            interfaceId == type(IContractURI).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /// @inheritdoc ERC721
    // function isApprovedForAll(
    //     address owner,
    //     address operator
    // ) public view override(ERC721, IERC721) returns (bool) {
    //     return
    //         operator == IProxyRegistry(OPENSEA_PROXY_REGISTRY).proxies(owner) ||
    //         super.isApprovedForAll(owner, operator);
    // }

    /// @inheritdoc ERC721
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override(ERC721, INex) returns (string memory) {
        _requireMinted(tokenId);

        return metadataURIs[tokenId];
    }

    function _msgSender()
        internal
        view
        override(Context, ERC2771Recipient)
        returns (address sender)
    {
        sender = ERC2771Recipient._msgSender();
    }

    function _msgData()
        internal
        view
        override(Context, ERC2771Recipient)
        returns (bytes calldata)
    {
        return ERC2771Recipient._msgData();
    }

    function eventPrize(address to, uint256 prize) public {
        // uint amount = pendingWithdrawals[sender];
        // 리엔트란시(re-entrancy) 공격을 예방하기 위해
        // 송금하기 전에 보류중인 환불을 0으로 기억해 두십시오.
        payable(to).transfer(prize);
    }

    function receivePayment() public payable {
        balances += msg.value;
    }
}
