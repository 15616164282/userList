//添加标记
// export default function addPoint (pointData, state, imgSize) {
//   for (let i = 0; i < pointData.length; i++) {
//     let WCMarker = new AMap.Marker({
//       position: new AMap.LngLat(pointData[i].location.split(",")[0], pointData[i].location.split(",")[1]),
//       // 将一张图片的地址设置为 icon
//       icon: new AMap.Icon({
//         image: state.WC,
//         size: new AMap.Size(imgSize, imgSize),
//         imageSize: new AMap.Size(imgSize, imgSize),
//       }),
//       // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
//       // offset: new AMap.Pixel(-13, -30),
//       // map: this.map,
//       title: pointData[i].name,
//     });
//     WCMarker.info = new AMap.InfoWindow({
//       content: pointData[i].name,
//       // offset: new AMap.Pixel(0, -30),
//     });
//     WCMarker.on("mouseover", function (e) {
//       e.target.info.open(state.map, e.target.getPosition());
//     });
//     state.markers.push(WCMarker);
//   }

// }

export default function addPoint (lng, lat, imgUrl, imgSize, attributes) {
  console.log(imgUrl);
  let WCMarker = new AMap.Marker({
    position: new AMap.LngLat(lng, lat),
    // 将一张图片的地址设置为 icon
    icon: new AMap.Icon({
      image: imgUrl,
      size: new AMap.Size(imgSize, imgSize),
      imageSize: new AMap.Size(imgSize, imgSize),
    }),
    // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
    // offset: new AMap.Pixel(-13, -30),
    // map: this.map,
    title: attributes.name,
  });
  // WCMarker.info = new AMap.InfoWindow({
  //   content: pointData[i].name,
  //   // offset: new AMap.Pixel(0, -30),
  // });
  WCMarker.on("mouseover", function (e) {
    e.target.info.open(state.map, e.target.getPosition());
  });
  // state.markers.push(WCMarker);
  return WCMarker
}