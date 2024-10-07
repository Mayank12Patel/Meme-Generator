/***** @start variables *********/
let textColor = document.getElementById('text-color').value;
let backgroundColor = document.getElementById('background-color').value;
let memes = [];
let imageName = '';
let canvasElement;
const MEME_URL = 'https://api.imgflip.com/get_memes';
const NO_IMAGE_TEMPLATE =
	'<div style="width:100%;height:100px;text-align:center">No images found</div>';
/******** @end variable ********/

/******** @start events ********/

/**
 *
 * Scroll though the meme viewer
 *
 */
function move(direction) {
	const total = direction === 'next' ? 100 : -100;
	const memeViewer = document.getElementById('memes-viewer');
	const scrollLeft = memeViewer.scrollLeft;
	memeViewer.scroll({
		left: scrollLeft + total,
		behavior: 'smooth',
	});
}

/**
 *  Picks a random image from the memes list
 *
 */
const random = () => {
	const randomIndex = Math.floor(Math.random() * (memes.length - 1));
	const randomElement = memes[randomIndex];
	fabric.Image.fromURL(randomElement.url, (img) => addImageToCanvas(img));
};

/**
 * Add text to events
 */
const addText = () => {
	canvasElement.add(
		new fabric.IText('New Text', {
			fontFamily: 'Roboto',
			top: canvasElement.getHeight() / 2,
			width: canvasElement.getWidth() / 2 - 50,
			fill: textColor ? textColor : 'white',
		})
	);

	canvasElement.renderAll();
};

/**
 * Filter image takes in events from onInputChange
 *
 * @param {Event} event
 */
let prev = [];
const filterImage = (event) => {
	const filterValue = event.srcElement.value.toUpperCase();
	const memesFiltered = memes.filter(
		(meme) => meme.name.toUpperCase().indexOf(filterValue) > -1
	);
	if (JSON.stringify(memesFiltered) !== JSON.stringify(prev)) {
		renderMemesList(memesFiltered);
	}
	prev = memesFiltered;
};

/**
 * Handles the color changes of the color picker
 *
 * @param {Event} event
 */
const colorChange = (event) => {
	textColor = event.srcElement.value;
	const activeItem = canvasElement.getActiveObject();
	console.log(event.srcElement.value);
	if (activeItem && activeItem.text) {
		document.getElementById('text-color-btn').style.color =
			event.srcElement.value;
		activeItem.set('fill', event.srcElement.value);
	}
	canvasElement.renderAll();
};

/**
 *
 * @param {Event} event
 */
const bgColorChange = (event) => {
	backgroundColor = event.srcElement.value;
	document.getElementById('background-color-btn').style.background =
		event.srcElement.value;
	canvasElement.backgroundColor = event.srcElement.value;
	canvasElement.renderAll();
};

const onFileChanged = (event, isBackground = true) => {
	const fileReader = new FileReader();
	fileReader.onload = (event) => {
		const uploadedImage = new Image();
		uploadedImage.src = event.target.result;
		uploadedImage.id = 0;
		uploadedImage.crossOrigin = '*';
		uploadedImage.onload = ()  => addImageToCanvas(uploadedImage, isBackground)
	};
	fileReader.readAsDataURL(event.target.files[0]);
};

const downloadImage = () => {
	const dataURL = canvasElement.toDataURL({
		width: canvasElement.width,
		height: canvasElement.height,
		left: 0,
		top: 0,
		format: 'png',
	});

	const link = document.createElement('a');
	link.download = getImageName(imageName);
	link.href = dataURL;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

/********** @end events ********/

/**
 * Render Memes View
 *
 * @namespace
 * @param {MemesItem[]} memes
 */
function renderMemesList(memes) {
	const memeViewer = document.getElementById('memes-viewer');
	memeViewer.innerHTML = '';
	if (memes.length <= 0) {
		memeViewer.innerHTML = NO_IMAGE_TEMPLATE;
	}
	memes.forEach((meme) => {
		const memeImage = new Image();
		memeImage.src = meme.url;
		memeImage.id = meme.id;
		memeImage.alt = meme.name;
		memeImage.width = 100;
		memeImage.height = 100;
		memeImage.crossOrigin = '*';
		memeImage.classList.add('w3-animate-opacity');
		memeImage.onclick = (event) => addImageToCanvas(event.srcElement);
		memeViewer.appendChild(memeImage);
	});
}

function renameImage(event) {
	imageName = event.srcElement.value;
}

/******* @start Event listeners *********/

document.addEventListener('DOMContentLoaded', () => {
	initCanvas();
	getMemes();
});

document.getElementById('memes-viewer').addEventListener('scroll', (e) => {
	const element = e.srcElement;
	const isEndOfList =
		element.scrollWidth - element.scrollLeft === element.clientWidth;
	if (isEndOfList) {
		document.getElementById('next').disabled = true;
	} else {
		document.getElementById('next').disabled = false;
	}

	if (element.scrollLeft === 0) {
		document.getElementById('prev').disabled = true;
	} else {
		document.getElementById('prev').disabled = false;
	}
});

/******* @end Event listeners *********/

/****** @start Canvas Handlers ******/

/**
 *  Initializes the Canvas with Fabric JS
 */
const initCanvas = () => {
	canvasElement = new fabric.Canvas('meme', { preserveObjectStacking: true });
	canvasElement.backgroundColor = 'black';
	canvasElement.renderAll();
	sizeCanvas();
	const selectImageMsg = new fabric.IText('Select a image to continue', {
		fontFamily: 'chalkboard',
		fill: 'white',
		fontSize: 20,
		top: canvasElement.getHeight() / 2,
		width: canvasElement.getWidth() / 2 - 50,
	});
	canvasElement.add(selectImageMsg);
	canvasElement.centerObject(selectImageMsg);
};

/**
 * Size the canvas based on the screen and if screen resizes
 */
const sizeCanvas = () => {
	const canvasContainer = document.getElementById('canvas-container');
	canvasElement.setWidth(canvasContainer.offsetWidth);
	canvasElement.setHeight(canvasContainer.offsetHeight);
	canvasElement.renderAll();
};

/**
 *  resets the canvas
 */
function resetCanvas() {
	canvasElement.clear();
	canvasElement.backgroundColor = backgroundColor;
}

/**
 * If an deletes selected about on canvas
 */
const deleteActiveObject = () => {
	if (canvasElement.getActiveObject()) {
		canvasElement.remove(canvasElement.getActiveObject());
	}
};

window.addEventListener('resize', sizeCanvas);

/**
 * Add image element to canvas
 *
 * @param {HTMLElement | Fabric.Image} srcElement
 */
const addImageToCanvas = (srcElement, isBackground = true) => {
	isBackground ? resetCanvas() : '';
	const imgInstance =
		srcElement instanceof HTMLElement
			? new fabric.Image(srcElement)
			: srcElement;
	imgInstance.scaleToHeight(canvasElement.getHeight());
	isBackground ? canvasElement.setBackgroundImage(imgInstance) : canvasElement.add(imgInstance);
	canvasElement.centerObject(imgInstance);
};

/****** @end Canvas Handlers ******/

/****** @start memes api request ********/
const getMemes = async () => {
	const fetchMemes = await fetch(MEME_URL);
	const { data } = await fetchMemes.json();
	memes = data.memes;
	renderMemesList(memes);
};
/****** @end memes ********/
