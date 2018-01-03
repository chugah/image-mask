var mycanvas;

$(document).ready(function() {
	console.log("ok");
	mycanvas = new fabric.Canvas('c');
	mycanvas.renderAll();

	//load main image
	fabric.Image.fromURL('./image.jpg', function(myImg) {
		var img1 = myImg.set({ left: 100, top: 100, width: 150, height: 150, selectable: false });
		mycanvas.add(img1);
		mycanvas.renderAll();

		fabric.Image.fromURL('./mask.jpg', function(myImg) {
			var img2 = myImg.set({ left: 300, top: 100, width: 150, height: 150 });
			mycanvas.add(img2);
			mycanvas.renderAll();

		var ctx = mycanvas.getContext('2d');
		var image1Data = ctx.getImageData(img1.left, img1.top, img1.width, img1.height);
		var image2Data = ctx.getImageData(img2.left, img2.top, img2.width, img2.height);

		var maskedImageData = maskImage(ctx, img1.width, img1.height, image1Data, image2Data);

		createFabricImageFromImageData(ctx, maskedImageData, img1.width, img1.height, mycanvas);

		});
	});
});

function maskImage(ctx, w, h, imageData1, imageData2) {
	var imageData1Pixels = imageData1.data;
	var imageData2Pixels = imageData2.data;
	var resultImgData = ctx.createImageData(w, h);

	for (var i = 0; i < imageData1Pixels.length; i += 4){
		resultImgData.data[i] = imageData1Pixels[i];
		resultImgData.data[i + 1] = imageData1Pixels[i + 1];
		resultImgData.data[i + 2] = imageData1Pixels[i + 2];

		var averageVal = ( imageData2Pixels[i] +  imageData2Pixels[i + 1] + imageData2Pixels[i + 2] ) / 3;
		resultImgData.data[i + 3] = averageVal;
	}
	return resultImgData;
}

function createFabricImageFromImageData(ctx, data, w, h, canvas) {
	var c = document.createElement('canvas');
	c.setAttribute('id', '_temp_canvas');
	c.width = w,
	c.height = h,
	c.getContext('2d').putImageData(data, 0, 0);

	fabric.Image.fromURL(c.toDataURL(), function(img) {
		img.left = 300;
		img.top = 300;
		canvas.add(img);
		img.bringToFront();
		c = null;
		$('#_temp_canvas').remove();
		canvas.renderAll();
	});
}