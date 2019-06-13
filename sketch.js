const boxSize = 30;
const gap = boxSize + 10;
const boxRows = 30;
const boxColumns = 30;
let ethSeed = 0;
let maxValXY = [0, 0];
let rowXColumn = [0,0];
let colorHolder = [];
let boxHolder = 0;
let cam;
function generatexy(data){
    const x = data[1];
    const y = data[2];
    maxValXY[0] = x > maxValXY[0] ? x : maxValXY[0]; 
    maxValXY[1] = x > maxValXY[1] ? x : maxValXY[1]; 
    return data[0] === 'sell';
}
function setup() {
    createCanvas(1000, 700, WEBGL);
    background(255);
    cam = createCamera();
    cam.camera(0, height*2, 150, 0, 0, 0, 0, 1, 0);
    const websocket = new WebSocket('wss://ws-feed.pro.coinbase.com');
    const subObject = {
        "type": "subscribe",
        "product_ids": [
            "ETH-USD",
            "ETH-EUR"
        ],
        "channels": [
            "level2",
            "heartbeat",
            {
                "name": "ticker",
                "product_ids": [
                    "ETH-BTC"
                ]
            }
        ]
      }
      websocket.addEventListener('open', function open() {
        websocket.send(JSON.stringify(subObject));
          console.log('opened');
      });

    websocket.addEventListener('message', function (event) {
    const data = event.data;
    //might skip this and do some string manupulation instead if its faster. I don't need all the elements.
    const parsed = JSON.parse(data);
    if (parsed.type === 'l2update'){
        parsed.changes.forEach(element => {
        ethSeed = generatexy(element);
        isRed = ethSeed ? 133 : 198;
        colorHolder[boxHolder] = isRed;
        boxHolder = boxHolder >= boxRows * boxColumns ? 0 : boxHolder += 1;
    });
}
});


}
  
  function draw() {
    background(240);
    orbitControl(0.3, 0.3);
    lights();
    translate(-900/2, -700/2, 0);
    colorHolder.map((e, i) => {
            const column = (i % boxColumns) * gap;
            const rowDec = (i/boxColumns);
            const row = Math.floor(rowDec) * gap;
            fill(255, 0, e);
            push();
            translate(row, column, e === 133 ? 0 : -15);
            box(boxSize);
            pop();
        });
  }
