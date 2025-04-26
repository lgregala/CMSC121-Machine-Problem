let nextBtn = document.querySelector('.plant-slider .next')
let prevBtn = document.querySelector('.plant-slider .prev')


let slider = document.querySelector('.plant-slider')
let sliderList = slider.querySelector('.plant-slider .plant-list')
let thumbnail = document.querySelector('.plant-slider .thumbnail')
let thumbnailItems = thumbnail.querySelectorAll('.slider-item')

thumbnail.appendChild(thumbnailItems[0])

// Function for next button 
nextBtn.onclick = function() {
    moveSlider('next')
}


// Function for prev button 
prevBtn.onclick = function() {
    moveSlider('prev')
}


function moveSlider(direction) {
    let sliderItems = sliderList.querySelectorAll('.slider-item')
    let thumbnailItems = document.querySelectorAll('.thumbnail .slider-item')
    
    if(direction === 'next'){
        sliderList.appendChild(sliderItems[0])
        thumbnail.appendChild(thumbnailItems[0])
        slider.classList.add('next')
    } else {
        sliderList.prepend(sliderItems[sliderItems.length - 1])
        thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1])
        slider.classList.add('prev')
    }

    


    slider.addEventListener('animationend', function() {
        if(direction === 'next'){
            slider.classList.remove('next')
        } else {
            slider.classList.remove('prev')
        }
    }, {once: true}) // Remove the event listener after it's triggered once
}

document.querySelectorAll('.see-more-btn').forEach(button => {
    button.addEventListener('click', function() {
      const mainCategory = this.getAttribute('data-main-category');
      window.location.href = `/products/?main_category=${encodeURIComponent(mainCategory)}`;
    });
  });