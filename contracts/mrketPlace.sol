// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
error nftMarketPlace__notZeroPriceNft();
error nftMarketPlace__notApprovedByMarketPlace();
error nftMarketPlace__alreadyListed(address nftAddress, uint256 tokenID);
error nftMarketPlace__notOwner();
error nftMarketPlace__notListed(address nftAddress, uint256 tokenID);
error nftMarketPlace__notListedPrice(
  address nftAddress,
  uint256 tokenId,
  uint256 price
);
error nftMarketPlace__notAnyProceed();
error nftMarketPlace__transactionFailed();

contract nftMarketPlace {
  struct Listing {
    uint256 price;
    address seller;
  }
  //events
  event itemListed(
    address indexed seller,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
  );
  event itemBought(
    address indexed buyer,
    address indexed nftAddress,
    uint256 indexed tokenID,
    uint256 Price
  );
  event itemCanceled(
    address indexed seller,
    address indexed nftAddress,
    uint256 indexed tokenID
  );

  //nft contract address=>tokenId=>(price,seller)
  mapping(address => mapping(uint256 => Listing)) private s_listings;
  mapping(address => uint256) private s_proceed;
  //modifiers
  modifier notListed(
    address nftAddress,
    uint256 tokenID,
    address owner
  ) {
    Listing memory listing = s_listings[nftAddress][tokenID];
    if (listing.price > 0) {
      revert nftMarketPlace__alreadyListed(nftAddress, tokenID);
    }
    _;
  }
  modifier isOwner(
    address nftAddress,
    uint256 tokenID,
    address spender
  ) {
    IERC721 nft = IERC721(nftAddress);
    address owner = nft.ownerOf(tokenID);
    if (spender != owner) {
      revert nftMarketPlace__notOwner();
    }
    _;
  }
  modifier isListed(address nftAddress, uint256 tokenID) {
    Listing memory listing = s_listings[nftAddress][tokenID];
    if (listing.price <= 0) {
      revert nftMarketPlace__notListed(nftAddress, tokenID);
    }
    _;
  }

  /*send nft to the contract=> transfer->contracts "hold "the nft
 owner can still hold their nft and approve the marketPlace to sell nft for them
   */
  /*
   * @notice Method for listing NFT
   * @param nftAddress Address of NFT contract
   * @param tokenId Token ID of NFT
   * @param price sale price for each item
   */
  /////////////////
  //main function//
  /////////////////
  function listItem(
    address nftAddress,
    uint256 tokenID,
    uint256 price
  )
    external
    notListed(nftAddress, tokenID, msg.sender)
    isOwner(nftAddress, tokenID, msg.sender)
  {
    if (price <= 0) {
      revert nftMarketPlace__notZeroPriceNft();
    }
    IERC721 nft = IERC721(nftAddress);
    if (nft.getApproved(tokenID) != address(this)) {
      //
      revert nftMarketPlace__notApprovedByMarketPlace();
    }
    s_listings[nftAddress][tokenID] = Listing(price, msg.sender);
    emit itemListed(msg.sender, nftAddress, tokenID, price);
  }

  function buyItem(
    address nftAddress,
    uint256 tokenID
  ) external payable isListed(nftAddress, tokenID) {
    Listing memory listedItem = s_listings[nftAddress][tokenID];
    if (msg.value < listedItem.price) {
      revert nftMarketPlace__notListedPrice(
        nftAddress,
        tokenID,
        listedItem.price
      );
    }
    s_proceed[listedItem.seller] = s_proceed[listedItem.seller] + msg.value;
    delete (s_listings[nftAddress][tokenID]);
    IERC721(nftAddress).safeTransferFrom(
      listedItem.seller,
      msg.sender,
      tokenID
    );
    emit itemBought(msg.sender, nftAddress, tokenID, listedItem.price);
  }

  function cancelItem(
    address nftAddress,
    uint256 tokenID
  )
    external
    isListed(nftAddress, tokenID)
    isOwner(nftAddress, tokenID, msg.sender)
  {
    delete (s_listings[nftAddress][tokenID]);
    emit itemCanceled(msg.sender, nftAddress, tokenID);
  }

  function updateItem(
    address nftAddress,
    uint256 tokenID,
    uint256 newPrice
  )
    external
    isListed(nftAddress, tokenID)
    isOwner(nftAddress, tokenID, msg.sender)
  {
    s_listings[nftAddress][tokenID].price = newPrice;
    emit itemListed(msg.sender, nftAddress, tokenID, newPrice);
  }

  function withdrawProceed() external {
    uint256 proceed = s_proceed[msg.sender];
    if (proceed <= 0) {
      revert nftMarketPlace__notAnyProceed();
    }
    s_proceed[msg.sender] = 0;
    (bool success, ) = payable(msg.sender).call{ value: proceed }("");
    if (!success) {
      revert nftMarketPlace__transactionFailed();
    }
  }

  //listItem-list item in nft market place
  //buyItem-buy the nft
  //replaceiTEM-cancle the listing
  //updatelisting-update the price
  //withdraw proceed -withdraw payment for my bought nfts
  ////////////////////
  //getter function //
  ////////////////////
  function getListing(
    address nftAddress,
    uint256 tokenID
  ) external view returns (Listing memory) {
    return s_listings[nftAddress][tokenID];
  }

  function getProceed(address seller) external view returns (uint256) {
    return s_proceed[seller];
  }
}
