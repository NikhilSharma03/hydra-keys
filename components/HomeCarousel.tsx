import Script from 'next/script'

const HomeCarousel = () => {
  return (
    <div>
      <h1>Membership Models</h1>
      <div className="slider">
        <div className="circular-slider circular-slider-1">
          <div className="wrapper">
            <div className="controls">
              <div className="controls__left">
                <div className="icon-wrapper">
                  <i className="far fa-arrow-alt-circle-left"></i>
                </div>
              </div>
              <div className="controls__right">
                <div className="icon-wrapper">
                  <i className="far fa-arrow-alt-circle-right"></i>
                </div>
              </div>
            </div>
            <div className="slides-holder">
              <div className="slides-holder__item slides-holder__item_active">
                <img src="/NFT.png" alt="img" />
              </div>
              <div className="slides-holder__item">
                <img src="/walletnew.png" alt="img" />
              </div>
              <div className="slides-holder__item">
                <img src="/token.png" alt="img" />
              </div>
              <div className="slides-holder__item">
                <img src="/NFT.png" alt="img" />
              </div>
              <div className="slides-holder__item">
                <img src="/walletnew.png" alt="img" />
              </div>
              <div className="slides-holder__item">
                <img src="/token.png" alt="img" />
              </div>
            </div>
            <div className="descriptions">
              <div className="descriptions__item descriptions__item_visible">
                <h1>NFT Membership</h1><br/>
                <p className="description">
                  Using NFTs, the membership is tied to an NFT mint address
                  instead of static public address. Each NFT mint address can
                  still have a different quantity of shares as in the Wallet
                  model
                </p>
              </div>
              <div className="descriptions__item">
                <h1>Wallet Membership</h1><br/>
                <p className="description">
                  {' '}
                  One of the simplest membership model. It&apos;s just a list of each
                  Member&apos;s public address and the number of shares they own.
                </p>
              </div>
              <div className="descriptions__item">
                <h1>Token Membership</h1><br/>
                <p className="description">
                  {' '}
                  The Token is the most flexible membership model, but is a bit
                  more complicated. In this model, Membership is associated with
                  staked ownership of the specified Token.
                </p>
              </div>
              <div className="descriptions__item">
                <h1>NFT Membership</h1><br/>
                <p className="description">
                  {' '}
                  Using NFTs, the membership is tied to an NFT mint address
                  instead of static public address. Each NFT mint address can
                  still have a different quantity of shares as in the Wallet
                  model
                </p>
              </div>
              <div className="descriptions__item">
                <h1>Wallet Membership</h1><br/>
                <p className="description">
                  {' '}
                  One of the simplest membership model. It&apos;s just a list of each
                  Member&apos;s public address and the number of shares they own.
                </p>
              </div>
              <div className="descriptions__item">
                <h1>Token Membership</h1><br/>
                <p className="description">
                  {' '}
                  The Token is the most flexible membership model, but is a bit
                  more complicated. In this model, Membership is associated with
                  staked ownership of the specified Token.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='min-size'>
      <div className="descriptions__item">
      <div className="desc_one">
                <h1>NFT Membership</h1><br/>
                <p className="description">
                  {' '}
                  Using NFTs, the membership is tied to an NFT mint address
                  instead of static public address. Each NFT mint address can
                  still have a different quantity of shares as in the Wallet
                  model
                </p>
                </div>
              </div>
              <div className="descriptions__item">
              <div className="desc_two">
                <h1>Wallet Membership</h1><br/>
                <p className="description">
                  {' '}
                  One of the simplest membership model. It&apos;s just a list of each
                  Member&apos;s public address and the number of shares they own.
                </p>
              </div>
              </div>
              <div className="descriptions__item">
              <div className="desc_three">
                <h1>Token Membership</h1><br/>
                <p className="description">
                  {' '}
                  The Token is the most flexible membership model, but is a bit
                  more complicated. In this model, Membership is associated with
                  staked ownership of the specified Token.
                </p>
                </div>
        </div>
      </div>
      <Script src="/slider.js" /><script defer src="https://use.fontawesome.com/releases/v5.0.6/js/all.js"></script>
      <style jsx>{`
        .slider {
          width: 60%;
          height: 60%;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          height: 60vh;
          display: -webkit-box;
          margin-left: 34vh;
          margin-bottom: 10vh;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        
        @media screen and (max-width: 960px) {
         
          .controls{
            display: none;
          }
          
          .slides-holder{
            display: none;
          }
          
          .description{
            display: content;
            text-align: center;
            padding-left: 15px;
            padding-right: 15px;
            height: 180px;
            font-size: 20px;
          }
          
          .desc_one{
            background-image: url("/NFT.png");
            background-repeat: no-repeat;
            background-position: 50%;
            background-size: 120px 120px;
          }

          .desc_two{
            background-image: url("/wallet.png");
            background-repeat: no-repeat;
            background-position: 50%;
            background-size: 120px 120px;
          }

          .desc_three{
            background-image: url("/token.png");
            background-repeat: no-repeat;
            background-position: 50%;
            background-size: 120px 120px;
          }
          
          .slider{
            display: none;
          }          

        }

        @media screen and (min-width: 960px){
          .min-size{
            display:none;
          }
        }
        
        @media screen and (max-width: 620px){
          
        }

        .circular-slider {
          width: 110%;
          height: 110%;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          -webkit-box-align: end;
          -ms-flex-align: end;
          align-items: flex-end;
        }

        .circular-slider .wrapper {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          position: relative;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          padding: 20px 20px 0px 20px;
          overflow: hidden;
        }

        .circular-slider .wrapper .controls__left,
        .circular-slider .wrapper .controls__right,
        .circular-slider .wrapper .controls__autoplay {
          position: absolute;
          z-index: 101;
          -webkit-transition: 0.6s all;
          -o-transition: 0.6s all;
          transition: 0.6s all;
        }

        .circular-slider .wrapper .controls__left:hover .icon-wrapper,
        .circular-slider .wrapper .controls__right:hover .icon-wrapper,
        .circular-slider .wrapper .controls__autoplay:hover .icon-wrapper {
          font-size: 1.7em;
          opacity: 1;
        }

        .circular-slider .wrapper .controls__left .icon-wrapper,
        .circular-slider .wrapper .controls__right .icon-wrapper,
        .circular-slider .wrapper .controls__autoplay .icon-wrapper {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          width: 100%;
          height: 100%;
          color: #485058;
          font-size: 1.5em;
          opacity: 0.7;
        }

        .circular-slider .wrapper .controls__left,
        .circular-slider .wrapper .controls__right {
          top: 50%;
        }

        .circular-slider .wrapper .controls__left {
          left: 0;
          -webkit-transform: translateY(-50%);
          -ms-transform: translateY(-50%);
          transform: translateY(-50%);
        }

        .circular-slider .wrapper .controls__left:hover {
          left: 0;
        }

        .circular-slider .wrapper .controls__right {
          right: 0;
          -webkit-transform: translate(0%, -50%);
          -ms-transform: translate(0%, -50%);
          transform: translate(0%, -50%);
        }

        .circular-slider .wrapper .controls__autoplay {
          bottom: 0;
          left: 50%;
          -webkit-transform: translate(-50%, 0%);
          -ms-transform: translate(-50%, 0%);
          transform: translate(-50%, 0%);
        }

        .circular-slider .wrapper .controls__autoplay_running .pause {
          display: block;
        }
        .circular-slider .wrapper .controls__autoplay_running .run {
          display: none;
        }

        .circular-slider .wrapper .controls__autoplay_paused .pause {
          display: none;
        }

        .circular-slider .wrapper .controls__autoplay_paused .run {
          display: block;
        }

        .circular-slider .wrapper .slides-holder {
          border-radius: 70%;
          border: 1px dotted rgb(61, 66, 71);
          -webkit-transform-origin: center;
          -ms-transform-origin: center;
          transform-origin: center;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          position: relative;
          z-index: 100;
        }

        .circular-slider .wrapper .slides-holder__item {
          border-radius: 50%;
          border: 1.5px dotted #7c99b4;
          position: absolute;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          -webkit-transform-origin: center;
          -ms-transform-origin: center;
          transform-origin: center;
          background-color: #222;
          -webkit-transition: 0.3s linear all;
          -o-transition: 0.3s linear all;
          transition: 0.3s linear all;
          -webkit-filter: brightness(70%);
          filter: brightness(70%);
        }

        .circular-slider .wrapper .slides-holder__item img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        .circular-slider .wrapper .slides-holder__item_active {
          -webkit-filter: brightness(100%);
          filter: brightness(100%);
        }

        .circular-slider .wrapper .descriptions {
          position: absolute;
          bottom: 0%;
          z-index: 0;
        }

        .circular-slider .wrapper .descriptions__item {
          width: 100%;
          height: 0%;
          opacity: 0;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -ms-flex-direction: column;
          flex-direction: column;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          -webkit-transition: opacity 0s 0s linear;
          -o-transition: opacity 0s 0s linear;
          transition: opacity 0s 0s linear;
          font-size: 13px;
        }

        .circular-slider .wrapper .descriptions__item_visible {
          height: 100%;
          opacity: 1;
          -webkit-transition: opacity 0.6s 0s linear;
          -o-transition: opacity 0.6s 0s linear;
          transition: opacity 0.6s 0s linear;
        }

        .circular-slider .wrapper .descriptions__item h1,
        .circular-slider .wrapper .descriptions__item .description {
          font-family: Helvetica, sans-serif;
          text-align: center;
        }

        .circular-slider .wrapper .descriptions__item h1 {
          font-size: 200%;
        }

        .circular-slider .wrapper .descriptions__item .description {
          font-size: 150%;
          padding: 0% 10%;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
          overflow-y: hidden;
        }
      `}</style>
    </div>
  )
}

export default HomeCarousel
