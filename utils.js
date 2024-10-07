/********** @start utils **********/

const getFormattedTime = () => {
  var today = new Date();
  var y = today.getFullYear();
  // JavaScript months are 0-based.
  var m = today.getMonth() + 1;
  var d = today.getDate();
  var h = today.getHours();
  var mi = today.getMinutes();
  var s = today.getSeconds();
  return y + '-' + m + '-' + d + '-' + h + '-' + mi + '-' + s;
}



function getImageName(imageName) {
  if (imageName === '') {
    return `image_${getFormattedTime()}.png`;
  } else if (imageName.includes('.png')) {
    return imageName;
  } else {
    return `${imageName}.png`;
  }
}

const clickElementById = (id, options) => {
  const element = document.getElementById(id);
  if(options) {
    Object.keys(options).forEach((attr) => {
      element.setAttribute(`data-${attr}`, options[attr]);
    })

  }
	element.click();
}

/********** @end utils **********/
