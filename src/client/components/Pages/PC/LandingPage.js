import React, { Component } from "react";
import QRCode from "qrcode.react";
<<<<<<< HEAD
import styled, { css } from "styled-components";
=======
import styled from "styled-components";
>>>>>>> dcb306f1d0f289e71a594241b19a0d0ed13031ed
import Constants from "../../../../shared/constants";
import { Card, Divider } from "antd";
import Title from "antd/lib/typography/Title";
import wiz_red from "./assets/redLP.png";
import wiz_blue from "./assets/blueLP.png";
import tree from "./assets/tree.png";

const Wrapper = styled.section`
  display: flex;
  width: 100vw;
  height: 90vh;
  justify-content: center;
  align-items: center;
`;

const Tutorial = styled.section`
  display: flex;
  width: 100vw;
  justify-content: center;
`;

const Centered = styled.section`
  display: flex;
  justify-content: center;
`;

const Description = styled.section`
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 1.5em;
  font-weight: bold;
`;

const Image = styled.img`
  position: absolute;
  width: 480px;
  bottom: -80px;
  ${({ left }) => (left ? "left: -130px;" : "right: -120px;")}
  ${({ left }) => `transform:
        rotate3d(0, ${left ? 0 : 1}, 0, 180deg)`};
  z-index: 10;
`;

const Tree = styled.img`
    position: absolute;
    width: ${({ left }) => (left ? "350px" : "420px")}
    bottom: -70px;
    ${({ left }) => (left ? "left: -300px;" : "right: -320px;")}
    ${({ left }) => `transform:
        rotate3d(0, ${left ? 0 : 1}, 0, 180deg)
        `};
    z-index: 5;
`;

const HoverAnimation = styled.div`
  transition: all 1s ease-in-out
       &:hover {
    transform: scale(1.2);
  }
`;

class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef();
    const url =
      window.location.protocol +
      "//" +
      window.location.host +
      "/mobile/" +
      props.userId;

    this.state = {
      qrCode: url,
      tinyUrl: url
    };

    // this.fetchTinyUrl(url).then(res => {
    //   this.setState({ tinyUrl: res });
    // }, _ => {
    //   this.setState({ tinyUrl: url });
    // });

    this.props.socket.on(Constants.MSG.WAITING_FOR_GAME, () => {
      this.props.history.push("/waiting");
    });
  }

  // fetchTinyUrl(url) {
  //   return new Promise((resolve, reject) => {
  //     fetch('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url), {
  //         // mode: 'no-cors',
  //         method: 'GET'
  //       },
  //     ).then(response => {
  //       console.log(response);
  //       if (response.ok) {
  //         response.text().then(body => {
  //           resolve(body);
  //         });
  //       } else {
  //         reject(response);
  //       }
  //     });
  //   })
  // }

  componentDidMount() {
    this.props.socket.emit(Constants.MSG.PREPARE_PLAYER, {
      uuid: this.props.userId
    });
    this.renderCanvas();
  }

  renderCanvas() {
    var Canvas = document.getElementById("canvas");
    var ctx = Canvas.getContext("2d");

    var resize = function() {
      Canvas.width = Canvas.clientWidth;
      Canvas.height = Canvas.clientHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    var elements = [];
    var presets = {};

    presets.o = function(x, y, s, dx, dy) {
      return {
        x: x,
        y: y,
        r: 20 * s,
        w: 5 * s,
        dx: dx,
        dy: dy,
        draw: function(ctx, t) {
          this.x += this.dx;
          this.y += this.dy;

          ctx.beginPath();
          ctx.arc(
            this.x + +Math.sin((50 + x + t / 10) / 100) * 3,
            this.y + +Math.sin((45 + x + t / 10) / 100) * 4,
            this.r,
            0,
            2 * Math.PI,
            false
          );
          ctx.lineWidth = this.w;
          ctx.strokeStyle = "#fff";
          ctx.stroke();
        }
      };
    };

    presets.x = function(x, y, s, dx, dy, dr, r) {
      r = r || 0;
      return {
        x: x,
        y: y,
        s: 20 * s,
        w: 5 * s,
        r: r,
        dx: dx,
        dy: dy,
        dr: dr,
        draw: function(ctx, t) {
          this.x += this.dx;
          this.y += this.dy;
          this.r += this.dr;

          var _this = this;
          var line = function(x, y, tx, ty, c, o) {
            o = o || 0;
            ctx.beginPath();
            ctx.moveTo(-o + (_this.s / 2) * x, o + (_this.s / 2) * y);
            ctx.lineTo(-o + (_this.s / 2) * tx, o + (_this.s / 2) * ty);
            ctx.lineWidth = _this.w;
            ctx.strokeStyle = c;
            ctx.stroke();
          };

          ctx.save();

          ctx.translate(
            this.x + Math.sin((x + t / 10) / 100) * 5,
            this.y + Math.sin((10 + x + t / 10) / 100) * 2
          );
          ctx.rotate((this.r * Math.PI) / 180);

          line(-1, -1, 1, 1, "#fff");
          line(1, -1, -1, 1, "#fff");

          ctx.restore();
        }
      };
    };

    for(var x = 0; x < Canvas.width; x++) {
        for(var y = 0; y < Canvas.height; y++) {
            if(Math.round(Math.random() * 8000) === 1) {
                var s = ((Math.random() * 5) + 1) / 10;
                if(Math.round(Math.random()) === 1)
                    elements.push(presets.o(x, y, s, 0, 0));
                else
                    elements.push(presets.x(x, y, s, 0, 0, ((Math.random() * 3) - 1) / 10, (Math.random() * 360)));
            }
        }
      }
    }

    setInterval(function() {
      ctx.clearRect(0, 0, Canvas.width, Canvas.height);

      var time = new Date().getTime();
      for (var e in elements) elements[e].draw(ctx, time);
    }, 10);
  }

  render() {
    return (
      <>
        <div style={{ position: "fixed", width: "100vw", height: "100vh" }}>
          <canvas
            id="canvas"
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: "linear-gradient(#1a1aff, cyan)",
              zIndex: -1
            }}
          />
        </div>
        <Wrapper>
          <Card
            style={{
              position: "relative",
              background: "rgba(255, 255, 255, .8)",
              borderRadius: "5px",
              maxWidth: "65vw"
            }}
          >
            <Centered>
              <HoverAnimation>
                <Title
                  style={{
                    fontFamily: "OurFont",
                    fontSize: "10em",
                    fontWeight: 10
                  }}
                >
                  Casta Fasta
                </Title>
              </HoverAnimation>
            </Centered>
            <Description>
              Prepare yourself for some really fast magic duels with a very
              extraordinary twist. All you need to do is to keep this page
              opened and scan QR code on this page with your smartphone.
            </Description>
            <Divider />
            <Centered>
              <QRCode value={this.state.qrCode} style={{ zIndex: 100 }} />
            </Centered>
            <Divider />
            <Description level={5} style={{ padding: 5, zIndex: 200 }}>
              or visit this address on your mobile device:
            </Description>
            <Centered>
              <a href={this.state.tinyUrl} style={{ zIndex: 100 }}>
                {this.state.tinyUrl}
              </a>
            </Centered>
            <Image src={wiz_red} left />
            <Image src={wiz_blue} />
            {/*<Tree src={tree} left />*/}
            <Tree src={tree} />
          </Card>
        </Wrapper>
        <Tutorial>
          <Card
            style={{
              position: "relative",
              background: "rgba(255, 255, 255, .8)",
              borderRadius: "5px",
              maxWidth: "65vw"
            }}
          >
            <Centered>
              <HoverAnimation>
                <Title
                  style={{
                    fontFamily: "OurFont",
                    fontSize: "6em",
                    fontWeight: 10
                  }}
                >
                  Tutorial
                </Title>
              </HoverAnimation>
            </Centered>
            <Description>Once upon a time, a Masta Casta rises.</Description>
            <Divider />
            <Description>
              Welcome to the wizardy fights. You will use your phone as a wand
              to cast spells. Everyday's a moment to prove yourself to be Masta
              Casta.
            </Description>
            <Divider />
            <Description>
              Scan the QR code with your smartphone to join the game. Challenge
              your friends or one of our apprentices. A true Casta masta Fire,
              Ice, Wind, and Earth.
            </Description>
            <Divider />
            <Description>
              During the fight, first choose your attack spell from 4 elements
              and 3 tiers of power. Choose wisely! The more power, the harder to
              cast.
            </Description>
            <Divider />
            <Description>
              Point with your phone against the screen and rotate it to the
              shown directions. You, your wand, your mind. There's only one
              path.
            </Description>
            <Divider />
            <Description>
              Once you complete the movements, enjoy your opponent's suffering.
              Precision and speed is the path to the victory. Casta, Fasta!
            </Description>
          </Card>
        </Tutorial>
      </>
    );
  }
}

export default LandingPage;
