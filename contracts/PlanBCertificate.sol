// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "@openzeppelin/contracts@4.7.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.2/utils/Counters.sol";
import "@openzeppelin/contracts@4.7.2/access/Ownable.sol";
import "@openzeppelin/contracts@4.7.2/token/ERC721/extensions/ERC721URIStorage.sol";

contract PlanBCertificate is ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;

    struct Event {
        mapping(address => bool) eventAdmins;

        // Mapping from owner address to token ID
        mapping(address => uint256) ownerToToken;
    }

    address private admin;
    Counters.Counter private _tokenIdCounter;
    mapping(uint => Event) private events;

    modifier onlyAdmin {
        require (tx.origin == admin);
        _;
    }

    modifier eventAdmin(uint eventId) {
        require (isAdmin(eventId, tx.origin) == true);
        _;
    }

    constructor() ERC721("PlanB Certificate", "PLANB") {
        admin = msg.sender;
    }

    function addEventAdmin(uint eventId, address adminAddress) external onlyAdmin {
        require(events[eventId].eventAdmins[adminAddress] == false);

        events[eventId].eventAdmins[adminAddress] = true;
    }

    function deleteEventAdmin(uint eventId, address adminAddress) external onlyAdmin {
        require(events[eventId].eventAdmins[adminAddress] == true);

        events[eventId].eventAdmins[adminAddress] = false;
    }

    function safeMint(address to, string memory uri, uint eventId) external virtual eventAdmin(eventId) {

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        events[eventId].ownerToToken[to] = tokenId;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function getTokenForOwner(address owner, uint eventId) external view returns (uint256 tokenId) {
        tokenId = events[eventId].ownerToToken[owner];
        require(tokenId > 0);
    }

    // Private functions

    function isAdmin(uint eventId, address addr) private view returns(bool) {
        return (events[eventId].eventAdmins[addr] || addr == admin);
    }

    function _transfer(address,
        address,
        uint256) override internal pure {

        require(false, "PlanB Certificate can't be transferred");

    } 

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}

