import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = process.env.PORT || 5000;


app.use(bodyParser.json());


app.listen(port, () => {
  
  console.log(`Server running on http://localhost:${port}`);
  let objGalleries = {};

  let objArtworks = {};
  

  app.get('/galleries', (req, res) => {
    res.json({'Galleries': objGalleries});
  });

  app.post('/addGallery', (req, res) => {
    let objGallery = req.body;
    objGalleries[objGallery.address] = {
      'Name': objGallery.Name,
      'Royalty': objGallery.Royalty,
      'Owner': objGallery.Owner,
    }
    res.json({'message': 'Gallery added successfully!'});
  });

  app.post('/removeArtwork', (req, res) => {
    let details = req.body;
    let metadataIpfs = details.metadataIpfs;
    let galleryAddress = details.galleryAddress;
    let findArray = objArtworks[galleryAddress];
    let index = findArray.findIndex((element) => element['metadataIpfs'] === metadataIpfs);
    objArtworks[galleryAddress].splice(index, 1);

    res.json({'message': 'Artwork removed successfully!'});
  });

  app.post('/addArtwork', (req, res) => {
    let objArtwork = req.body;
    let artObject = {
      'artName': objArtwork.artName,
      'artistName': objArtwork.artistName,
      'price': objArtwork.price,
      'artistRoyalty': objArtwork.artistRoyalty,
      'artistWalletAddress': objArtwork.artistWalletAddress,
      'imageIpfs': objArtwork.imageIpfs,
      'metadataIpfs': objArtwork.metadataIpfs,
    }
    let galleryAddress = objArtwork['galleryAddress'];
    objArtworks[galleryAddress] = objArtworks[galleryAddress] || [];
    objArtworks[galleryAddress].push(artObject);

    res.json({'message': 'Artwork added successfully!'});
  });

  app.get('/gallery/:address', (req, res) => {
    res.json({'Artworks': objArtworks[req.params.address]});
  })
});
