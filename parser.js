// @todo: напишите здесь код парсера

function parsePage() {
    const pageLanguage = document.documentElement.getAttribute('lang');
    const pageTitle = document.querySelector('title').textContent.split('—')[0].trim();
    const pageKeywords = document.querySelector('meta[name="keywords"]').getAttribute('content').split(',').map(item => item.trim());
    const pageMetaDescription = document.querySelector('meta[name="description"]').getAttribute('content').trim();
    const pageOgTitle = document.querySelector('meta[property="og:title"]').getAttribute('content').split('—')[0].trim();
    const pageOgImage = document.querySelector('meta[property="og:image"]').getAttribute('content').trim();
    const pageOgType = document.querySelector('meta[property="og:type"]').getAttribute('content').trim();

    const productId = document.querySelector('.product').dataset.id;

    const imagesProducts = [];
    const pageImagesProducts = document.querySelectorAll('.product .preview nav button').forEach(item => {
        const imageInButton = item.querySelector('img');
        imagesProducts.push({
            preview: imageInButton.getAttribute('src'),
            full: imageInButton.dataset.src,
            alt: imageInButton.getAttribute('alt')
        });
    });

    const likedStatus = document.querySelector('figure .like').classList.contains('active');
    const nameProduct = document.querySelector('h1').textContent.trim();

    const tagsArray = {category: [], discount: [], label: []};
    const tagsProduct = document.querySelectorAll('.tags span').forEach(item => {
        if(item.classList.contains('green')) {
            tagsArray.category.push(item.textContent.trim());
        }
        if(item.classList.contains('red')) {
            tagsArray.discount.push(item.textContent.trim());
        }
        if(item.classList.contains('blue')) {
            tagsArray.label.push(item.textContent.trim());
        }
    });

    const allPrices = document.querySelector('.product .price').textContent.trim();
    const prices = allPrices.split('₽').map(item => item.trim()).filter(Boolean);
    const price = parseInt(prices[0]);
    const oldPrice = parseInt(prices[1]);
    let discount;
    if(oldPrice - price === oldPrice) {
        discount = '0%';
    } else {
        discount = oldPrice - price;
    }
    const currency = 'RUB';
    const discountPercent = ((discount / oldPrice) * 100).toFixed(2) + '%';

    const property = {};
    const propertyProducts = document.querySelectorAll('.properties li').forEach(item => {
        const spanArray = item.querySelectorAll('span');
        const keys = spanArray[0].textContent.trim();
        const values = spanArray[1].textContent.trim();
        property[keys] = values;
    });

    const descriptionAttributes = document.querySelector('.description');
    const cloneDescription = descriptionAttributes.cloneNode(true);
    const titledescription = cloneDescription.querySelector('h3');
    titledescription.removeAttribute('class');
    const description = cloneDescription.innerHTML.trim();

    const suggested = [];
    document.querySelectorAll('.suggested .items article').forEach(item => {
        suggested.push({
            name: item.querySelector('h3').textContent.trim(),
            description: item.querySelector('p').textContent.trim(),
            image: item.querySelector('img').getAttribute('src'),
            price: item.querySelector('b').textContent.slice(1).trim(),
            currency: 'RUB'
        });
    });

    const reviews =[];
    document.querySelectorAll('.reviews .items article').forEach(item => {
        reviews.push({
            rating: item.querySelectorAll('.rating .filled').length,
            author: {
                avatar: item.querySelector('.author img').getAttribute('src'),
                name: item.querySelector('.author span').textContent.trim()
            },
            title: item.querySelector('.title').textContent.trim(),
            description: item.querySelector('p').textContent.trim(),
            date: item.querySelector('i').textContent.replace(/\//g, '.').trim()
        });
    });

    return {
        meta: {
            title: pageTitle,
            description: pageMetaDescription,
            keywords: pageKeywords,
            language: pageLanguage,
            opengraph: {
                title: pageOgTitle,
                image: pageOgImage,
                type: pageOgType
            }
        },
        product: {
            id: productId,
            images: imagesProducts,
            isLiked: likedStatus,
            name: nameProduct,
            tags: tagsArray,
            price: price,
            oldPrice: oldPrice,
            discount: discount,
            discountPercent: discountPercent,
            currency: currency,
            properties: property,
            description, description,
        },
        suggested: suggested,
        reviews: reviews
    };
}

window.parsePage = parsePage;