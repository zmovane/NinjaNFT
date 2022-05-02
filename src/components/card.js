import { Wallpaper } from "./wallpaper";

export const CardType = {
  HOME_ON_SALE: Symbol(),
  MINE_LISTED: Symbol(),
  MINE_NO_LISTED: Symbol(),
};
export function Card({ key, data, onClick, type }) {
  return (
    <div key={key} className="card card-compact bg-base-100 shadow-xl">
      <figure>
        <Wallpaper src={data.image} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{data.name}</h2>
        <p>{data.description}</p>
        {type == CardType.MINE_NO_LISTED || (
          <div className="justify-start text-pink-400 font-bold">
            {data.price} ETH
          </div>
        )}
        {type == CardType.HOME_ON_SALE || type == CardType.MINE_NO_LISTED ? (
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              onClick={onClick}
              style={{ minWidth: "6rem" }}
            >
              {type == CardType.HOME_ON_SALE ? "Buy Now" : "List"}
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
