import React, { Component } from "react";
import QRCode from "qrcode.react";
import styled, {css} from "styled-components";
import Constants from "../../../../shared/constants";
import { Card, Divider } from "antd";
import Title from "antd/lib/typography/Title";
import wiz_red from "./assets/redLP.png"
import wiz_blue from "./assets/blueLP.png"
import tree from "./assets/tree.png"

const http = require("http");

const Wrapper = styled.section`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
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
  padding: 50px;
`;

const Image = styled.img`
    position: absolute;
    width: 480px;
    bottom: -70px;
    ${({left}) => left ? "left: -150px;" : "right: -150px;"}
    ${({left}) => `transform: 
        rotate3d(0, ${left ? 0 : 1}, 0, 180deg)`
    };
    z-index: 10;
`;

const Tree = styled.img`
    position: absolute;
    width: ${({left}) => left ? "350px" : "420px"}
    bottom: -60px;
    ${({left}) => left ? "left: -300px;" : "right: -350px;"}
    ${({left}) => `transform: 
        rotate3d(0, ${left ? 0 : 1}, 0, 180deg)
        `
    };
    z-index: 5;
`;

const HoverAnimation = styled.div`
       transition: all 1s ease-in-out
       &:hover{
           transform: scale(1.2)
       }
`;

class LandingPage extends Component {

  constructor(props) {
    super(props);

    this.canvas = React.createRef();
    const url = window.location.protocol + "//" + window.location.host + "/mobile/" + props.userId;

    this.state = {
      qrCode: url
    };

    this.fetchTinyUrl(url).then(res => {
      console.log(res);
      this.setState({ tinyUrl: res });
    }, err => {
      console.log(err);
      this.setState({ tinyUrl: url });
    });

    this.props.socket.on(Constants.MSG.WAITING_FOR_GAME, () => {
      this.props.history.push("/waiting");
    });
  }

  fetchTinyUrl(url) {
    return new Promise((resolve, reject) => {
      http.get('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url), res => {
        res.on('data', chunk => {
          resolve(chunk.toString())
        })
      }).on("error", err => {
        reject(err)
      })
    })
  }

  componentDidMount() {
    this.props.socket.emit(Constants.MSG.PREPARE_PLAYER, {
      uuid: this.props.userId
    });
    this.renderCanvas()
  }

  renderCanvas () {
    var Canvas = document.getElementById('canvas');
    var ctx = Canvas.getContext('2d');

    var resize = function() {
        Canvas.width = Canvas.clientWidth;
        Canvas.height = Canvas.clientHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    var elements = [];
    var presets = {};

    presets.o = function (x, y, s, dx, dy) {
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
                ctx.arc(this.x + + Math.sin((50 + x + (t / 10)) / 100) * 3, this.y + + Math.sin((45 + x + (t / 10)) / 100) * 4, this.r, 0, 2 * Math.PI, false);
                ctx.lineWidth = this.w;
                ctx.strokeStyle = '#fff';
                ctx.stroke();
            }
        }
    };

    presets.x = function (x, y, s, dx, dy, dr, r) {
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
                    ctx.moveTo(-o + ((_this.s / 2) * x), o + ((_this.s / 2) * y));
                    ctx.lineTo(-o + ((_this.s / 2) * tx), o + ((_this.s / 2) * ty));
                    ctx.lineWidth = _this.w;
                    ctx.strokeStyle = c;
                    ctx.stroke();
                };

                ctx.save();

                ctx.translate(this.x + Math.sin((x + (t / 10)) / 100) * 5, this.y + Math.sin((10 + x + (t / 10)) / 100) * 2);
                ctx.rotate(this.r * Math.PI / 180);

                line(-1, -1, 1, 1, '#fff');
                line(1, -1, -1, 1, '#fff');

                ctx.restore();
            }
        }
    };

    for(var x = 0; x < Canvas.width; x++) {
        for(var y = 0; y < Canvas.height; y++) {
            if(Math.round(Math.random() * 8000) == 1) {
                var s = ((Math.random() * 5) + 1) / 10;
                if(Math.round(Math.random()) == 1)
                    elements.push(presets.o(x, y, s, 0, 0));
                else
                    elements.push(presets.x(x, y, s, 0, 0, ((Math.random() * 3) - 1) / 10, (Math.random() * 360)));
            }
        }
    }

    setInterval(function() {
        ctx.clearRect(0, 0, Canvas.width, Canvas.height);

        var time = new Date().getTime();
        for (var e in elements)
            elements[e].draw(ctx, time);
    }, 10);
  }

  render() {
    return (
      <>
          <div style={{position: "fixed", width: "100vw", height: "100vh"}}>
            <canvas id="canvas" style={{width: "100%", height: "100%", backgroundImage: "linear-gradient(#1a1aff, cyan)", zIndex: -1}} />
          </div>
        <Wrapper>
          <Card style={{position: "relative", background: "rgba(255, 255, 255, .8)", borderRadius: "5px", maxWidth:"60vw"}}>
            <Centered>
              <HoverAnimation>
                  <Title style={{
                      fontFamily: "OurFont",
                      fontSize: "10em",
                      fontWeight: 10
                  }}>Casta Fasta</Title>
              </HoverAnimation>
            </Centered>
            <Description>
              Prepare yourself for some really fast magic duels with a very
              extraordinary twist. All you need to do is to keep this page opened
              and scan QR code on this page with your smartphone.
            </Description>
            <Divider dashed />
            <Centered>
              <QRCode value={this.state.qrCode} />
            </Centered>
            <Divider dashed />
            <Centered>
              <a href={this.state.tinyUrl}>
                Or visit this link to join the game.
              </a>
            </Centered>
            <Image src={wiz_red} left />
            <Image src={wiz_blue} />
            {/*<Tree src={tree} left />*/}
            <Tree src={tree}  />
          </Card>
        </Wrapper>
      </>
    );
  }
}

export default LandingPage;
