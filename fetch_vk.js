const fs = require('fs');
const fetch = require('node-fetch');

const TOKEN = process.env.VK_TOKEN; // токен берём из GitHub Secrets
const ALBUM_ID = '000';       // ID альбома (из ссылки)
const OWNER_ID = '364112563';      // ID группы (ставим минус перед ID сообщества)

async function fetchPhotos() {
  const url = 'https://api.vk.com/method/photos.get?owner_id=${OWNER_ID}&album_id=${ALBUM_ID}&access_token=${TOKEN}&v=5.131';

  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data,null,2));

  if (!data.response) {
    console.error('Ошибка:', data);
    return;
  }

  const photos = data.response.items.map(photo => {
    const sizes = photo.sizes;
    const maxSize = sizes[sizes.length - 1]; // берём самую большую картинку
    return maxSize.url;
  });

  fs.writeFileSync('photos.json', JSON.stringify(photos, null, 2));
  console.log('Фотографии сохранены в photos.json');
}

fetchPhotos();
