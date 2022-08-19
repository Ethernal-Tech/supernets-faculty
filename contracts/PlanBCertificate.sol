// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts@4.7.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.2/utils/Counters.sol";
import "@openzeppelin/contracts@4.7.2/access/Ownable.sol";
import "@openzeppelin/contracts@4.7.2/token/ERC721/extensions/ERC721URIStorage.sol";

contract PlanBCertificate is ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Mapping from owner address to token ID
    mapping(address => uint256) private _ownerToToken;

    constructor() ERC721("PlanB Certificate", "PLANB") {}

    function safeMint(address to, string memory uri) external virtual {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _ownerToToken[to] = tokenId;
    }

    function _transfer(address,
        address,
        uint256) override internal pure {

        require(false, "PlanB Certificate can't be transferred");

    } 

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function getTokenForOwner(address owner) external view returns (uint256) {
        require(owner != address(0), "Address zero is not a valid owner");
        return _ownerToToken[owner];
    }
}

