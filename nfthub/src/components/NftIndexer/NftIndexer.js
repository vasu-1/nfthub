// import "./erc-20Indexer.css";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useState } from "react";
import Loader from "../Loader/LoaderDNA";
import { alchemyMumbai as alchemy } from "../../configuration/settings";

export default function NftIndexer() {
  const [userAddress, setUserAddress] = useState("");
  const [nftdata, setnftdata] = useState("");
  const [nftnftcount, setnftnftcount] = useState("");
  const [loader, setloader] = useState("");

  function trunc(text) {
    return text.length > 10 ? `${text.substr(0, 10)}...` : text;
  }

  async function getTokenBalance() {
    setnftnftcount("");
    setloader(
      <div className="d-flex justify-content-center">
        <Loader></Loader>
      </div>
    );
    setnftdata("");

    // new approach
    const data = await alchemy.nft.getNftsForOwner(userAddress);
    // console.log("see here", data);

    const nftArray = [];
    for (let i = 0; i < data.ownedNfts.length; i++) {
      const tokenData = await alchemy.nft.getNftMetadata(
        data.ownedNfts[i].contract.address,
        data.ownedNfts[i].tokenId
      );
      // console.log(tokenData);
      var tokenaddr = `https://blockscan.com/address/${tokenData.contract.address}`;
      nftArray[i] = (
        <div className="col h-100" key={tokenData.tokenId}>
          <div className="card">
            <img
              src={tokenData.media[0].thumbnail}
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <h5 className="card-title">{tokenData.title}</h5>
              <p className="card-text">{tokenData.description}</p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                {tokenData.rawMetadata.external_link ? (
                  <a href={tokenData.rawMetadata.external_link} target="_blank">
                    External Link
                  </a>
                ) : (
                  "No Link"
                )}
              </li>
              <li className="list-group-item">
                Token Type{" "}
                <span className="badge bg-light">{tokenData.tokenType}</span>
              </li>
              {tokenData.rawMetadata.traits?.map((e, i) => {
                return (
                  <li className="list-group-item" key={i}>
                    {" "}
                    {e.trait_type} &nbsp;{" "}
                    <span className="badge bg-light">{e.value}</span>{" "}
                  </li>
                );
              })}
              <li className="list-group-item">
                <a href={tokenaddr} target="_blank">{tokenData.contract.name}</a>
              </li>
              <li className="list-group-item">
                Block No {" "} <span className="badge bg-light">{tokenData.contract.deployedBlockNumber}</span>
              </li>
            </ul>
            <div className="card-footer text-muted">
              <small>
                Updated Time:{" "}
                {new Date(Date.parse(tokenData.timeLastUpdated)).toDateString()}
              </small>
            </div>
          </div>
        </div>
      );
    }

    setnftdata(nftArray);
    setloader();
  }

  return (
    <>
      <div className="container mt-4 middle">
        <div
          className="border border-white rounded p-4"
          style={{ width: "40rem" }}
        >
          <h1>NFT Indexer</h1>
          <div className="m-1">On Mumbai Matic 🗼</div>
          <hr />
          <div className="form-group">
            <label htmlFor="walletAddress" className="form-label">
              Ethereum Wallet Address
            </label>
            <input
              type="text"
              pattern="^0x[a-fA-F0-9]{40}$"
              className="form-control"
              id="walletAddress"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              aria-describedby="emailHelp"
              placeholder="Enter wallet address"
            />
            <small id="emailHelp" className="form-text text-muted">
              Enter address for which you want to check NFTs
            </small>
          </div>
          <div className="d-flex justify-content-around">
            <button
              type="submit"
              id="transfer"
              onClick={getTokenBalance}
              className="btn btn-outline-light mt-4"
            >
              Check Your NFTs
            </button>
          </div>
        </div>
      </div>
      {loader}
      <div className="d-flex justify-content-center pt-3">{nftnftcount}</div>
      <div className="row middle container m-3 row-cols-1 row-cols-md-3 row-cols-lg-4 row-cols-sm-2">
        {nftdata}
      </div>
    </>
  );
}