import { useEffect } from 'react'

function startSetup(
  this: any,
  sliderSize: any,
  slideSize: any,
  animationDuration: any
) {
  this.sliderSize = parseFloat(sliderSize) / 100
  this.slideSize = parseFloat(slideSize) / 100
  this.animationDuration = parseFloat(animationDuration)
}

function Slider(
  this: any,
  newSlider: any,
  sliderSize: any,
  slideSize: any,
  animationDuration: any
) {
  this.startSetup = new startSetup(sliderSize, slideSize, animationDuration)
  this.wrapper = newSlider.querySelector('.wrapper')

  this.slides = newSlider.querySelectorAll(
    '.circular-slider .wrapper .slides-holder .slides-holder__item'
  )

  this.slidesSize = 0

  this.descriptionsHolder = newSlider.querySelector(
    '.circular-slider .wrapper .descriptions'
  )

  this.descriptions = newSlider.querySelectorAll(
    '.circular-slider .wrapper .descriptions .descriptions__item'
  )

  this.slidesHolder = newSlider.querySelector(
    '.circular-slider .wrapper .slides-holder'
  )

  this.btnLeft = newSlider.querySelector(
    '.circular-slider .wrapper .controls .controls__left'
  )

  this.btnRight = newSlider.querySelector(
    '.circular-slider .wrapper .controls .controls__right'
  )

  this.currentAngle = 0

  this.stepAngle =
    (2 * Math.PI) /
    newSlider.querySelectorAll(
      '.circular-slider .wrapper .slides-holder .slides-holder__item'
    ).length

  this.currentSlide = 0

  this.slidesHolder.style.transitionDuration =
    this.startSetup.animationDuration + 'ms'
  this.onResize()
  this.setNav()
  this.addStyle()
}

Slider.prototype.onResize = function () {
  let radius: any,
    w = this.wrapper.parentNode.getBoundingClientRect().width,
    h = this.wrapper.parentNode.getBoundingClientRect().height

  2 * h <= w
    ? (radius = h * this.startSetup.sliderSize)
    : (radius = (w / 2) * this.startSetup.sliderSize)

  this.setSize(Math.round(radius))
}

Slider.prototype.setSize = function (radius: any) {
  this.wrapper.style.width = 2 * radius + 'px'
  this.wrapper.style.height = radius + 'px'

  let r = 2 * radius * (1 - this.startSetup.slideSize)
  this.slidesHolder.style.width = this.slidesHolder.style.height = r + 'px'
  this.slidesRepositioning(r / 2)

  this.slidesHolder.style.marginTop = radius * this.startSetup.slideSize + 'px'
  this.descriptionsHolder.style.width =
    (r / 2 - r * this.startSetup.slideSize + 20) * 2 + 'px'
  this.descriptionsHolder.style.height =
    r / 2 - r * this.startSetup.slideSize + 20 + 'px'

  this.slidesSize = Math.min(
    2 * radius * this.startSetup.slideSize,
    this.stepAngle * radius * (1 - this.startSetup.slideSize) - 50
  )
  this.descriptionsHolder.style.fontSize =
    window.innerHeight < window.innerWidth ? '1.2vh' : '1.2vw'
  for (let i = 0; i < this.slides.length; i++) {
    this.slides[i].style.width = this.slides[i].style.height =
      this.slidesSize + 'px'
  }
}

Slider.prototype.slidesRepositioning = function (r: any) {
  for (let i = 0; i < this.slides.length; i++) {
    let x = r * Math.cos(this.stepAngle * i - Math.PI / 2),
      y = r * Math.sin(this.stepAngle * i - Math.PI / 2)
    this.slides[i].style.transform =
      'translate( ' +
      x +
      'px, ' +
      y +
      'px ) rotate( ' +
      ((this.stepAngle * 180) / Math.PI) * i +
      'deg )'
  }
}

Slider.prototype.rotate = function (multiplier: any) {
  let _this = this

  this.removeStyle()
  this.resetNavs()

  if (this.currentSlide === this.slides.length - 1 && multiplier === -1) {
    this.slidesHolder.style.transform = 'rotate( -360deg )'
    this.currentSlide = this.currentAngle = 0
    this.addStyle()

    setTimeout(function () {
      _this.slidesHolder.style.transitionDuration = 0 + 's'
      _this.slidesHolder.style.transform =
        'rotate( ' + _this.currentAngle + 'deg )'
      setTimeout(function () {
        _this.slidesHolder.style.transitionDuration =
          _this.startSetup.animationDuration + 'ms'
      }, 20)
    }, this.startSetup.animationDuration)
  } else if (this.currentSlide === 0 && multiplier === 1) {
    this.slidesHolder.style.transform =
      'rotate( ' + (this.stepAngle * 180) / Math.PI + 'deg )'
    this.currentSlide = _this.slides.length - 1
    this.currentAngle = (-(2 * Math.PI - _this.stepAngle) * 180) / Math.PI
    this.addStyle()

    setTimeout(function () {
      _this.slidesHolder.style.transitionDuration = 0 + 's'
      _this.slidesHolder.style.transform =
        'rotate( ' + _this.currentAngle + 'deg )'
      setTimeout(function () {
        _this.slidesHolder.style.transitionDuration =
          _this.startSetup.animationDuration + 'ms'
      }, 20)
    }, this.startSetup.animationDuration)
  } else {
    this.currentSlide -= multiplier
    this.currentAngle += ((this.stepAngle * 180) / Math.PI) * multiplier
    this.slidesHolder.style.transform = 'rotate( ' + this.currentAngle + 'deg )'
    this.addStyle()
  }
}

Slider.prototype.setNav = function () {
  let _this = this
  _this.btnLeft.onclick = function () {
    _this.rotate(1)
  }
  _this.btnRight.onclick = function () {
    _this.rotate(-1)
  }
}

Slider.prototype.disableNav = function () {
  this.btnLeft.onclick = null
  this.btnRight.onclick = null
}

Slider.prototype.setAutoplay = function () {
  let _this = this
  this.autoplay = setInterval(function () {
    _this.rotate(-1)
  }, _this.startSetup.autoplayInterval + 20)
}

Slider.prototype.removeStyle = function () {
  let x = this.currentSlide

  this.descriptions[x].classList.remove('descriptions__item_visible')
  this.slides[x].classList.remove('slides-holder__item_active')
  this.slides[x].style.height = this.slides[x].style.width =
    this.slidesSize + 'px'
}

Slider.prototype.addStyle = function () {
  let x = this.currentSlide

  this.descriptions[x].classList.add('descriptions__item_visible')
  this.slides[x].classList.add('slides-holder__item_active')
  this.slides[x].style.height = this.slides[x].style.width =
    this.slidesSize + 20 + 'px'
}

Slider.prototype.resetNavs = function () {
  let _this = this

  this.disableNav()
  setTimeout(function () {
    _this.setNav()
  }, this.startSetup.animationDuration + 20)
  if (this.autoplay != null) {
    clearInterval(this.autoplay)
    this.setAutoplay()
  }
}

const HomeCarousel = () => {
  useEffect(() => {
    let circularSlider1 = new Slider(
      document.querySelector('.circular-slider-1'),
      100,
      15,
      600
    )

    window.onresize = function () {
      circularSlider1.resetNavs()
      circularSlider1.onResize()
    }
  }, [])

  return (
    <div>
      <h1 className="text-center mb-6 w-full">Membership Models</h1>
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
                <h1>NFT Membership</h1>
                <br />
                <p className="description">
                  Using NFTs, the membership is tied to an NFT mint address
                  instead of static public address. Each NFT mint address can
                  still have a different quantity of shares as in the Wallet
                  model
                </p>
              </div>
              <div className="descriptions__item">
                <h1>Wallet Membership</h1>
                <br />
                <p className="description">
                  {' '}
                  One of the simplest membership model. It&apos;s just a list of
                  each Member&apos;s public address and the number of shares
                  they own.
                </p>
              </div>
              <div className="descriptions__item">
                <h1>Token Membership</h1>
                <br />
                <p className="description">
                  {' '}
                  The Token is the most flexible membership model, but is a bit
                  more complicated. In this model, Membership is associated with
                  staked ownership of the specified Token.
                </p>
                <span className="text-red-500 my-1">This membership model is not supported yet</span>
              </div>
              <div className="descriptions__item">
                <h1>NFT Membership</h1>
                <br />
                <p className="description">
                  {' '}
                  Using NFTs, the membership is tied to an NFT mint address
                  instead of static public address. Each NFT mint address can
                  still have a different quantity of shares as in the Wallet
                  model
                </p>
              </div>
              <div className="descriptions__item">
                <h1>Wallet Membership</h1>
                <br />
                <p className="description">
                  {' '}
                  One of the simplest membership model. It&apos;s just a list of
                  each Member&apos;s public address and the number of shares
                  they own.
                </p>
              </div>
              <div className="descriptions__item">
                <h1>Token Membership</h1>
                <br />
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
      <div className="min-size">
        <div className="descriptions__item">
          <div className="desc_one">
            <h1>NFT Membership</h1>
            <br />
            <p className="description">
              {' '}
              Using NFTs, the membership is tied to an NFT mint address instead
              of static public address. Each NFT mint address can still have a
              different quantity of shares as in the Wallet model
            </p>
          </div>
        </div>
        <div className="descriptions__item">
          <div className="desc_two">
            <h1>Wallet Membership</h1>
            <br />
            <p className="description">
              {' '}
              One of the simplest membership model. It&apos;s just a list of
              each Member&apos;s public address and the number of shares they
              own.
            </p>
          </div>
        </div>
        <div className="descriptions__item">
          <div className="desc_three">
            <h1>Token Membership</h1>
            <br />
            <p className="description">
              {' '}
              The Token is the most flexible membership model, but is a bit more
              complicated. In this model, Membership is associated with staked
              ownership of the specified Token.
              <br/>
              <span className="text-red-500 my-1">This membership model is not supported yet</span>
            </p>
          </div>
        </div>
      </div>
      <script
        defer
        src="https://use.fontawesome.com/releases/v5.0.6/js/all.js"
      ></script>
      <style jsx>{`
        .slider {
          width: 60%;
          height: 60%;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          height: 60vh;
          display: -webkit-box;
          margin: 16px auto;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        @media screen and (max-width: 960px) {

          
          h1{
            font-size: 40px;
          }
          .controls {
            display: none;
          }

          .slides-holder {
            display: none;
          }

          .description {
            display: content;
            text-align: center;
            padding-left: 15px;
            padding-right: 15px;
            height: 180px;
            font-size: 18px;
          }

          .desc_one {
            background-image: url('/NFT_low_opacity.png');
            background-repeat: no-repeat;
            background-position: 50%;
            background-size: 12rem 12rem;
          }

          .desc_two {
            background-image: url('/walletnew_low_opacity.png');
            background-repeat: no-repeat;
            background-position: 50%;
            background-size: 12rem 12rem;
          }

          .desc_three {
            background-image: url('/token_low_opacity.png');
            background-repeat: no-repeat;
            background-position: 50%;
            background-size: 12rem 12rem;
          }

          .slider {
            display: none;
          }
        }

        @media screen and (min-width: 960px) {
          .min-size {
            display: none;
          }
        }

        @media screen and (max-width: 620px) {
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
          width: 32px;
          height: 32px;
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
