/* eslint-disable */
module.exports = class BuildRepository {
  constructor(database) {
    this.database = database;
  }

  async getCompanies(
    companyAttributes, productAttributes, productVariationAttributes, productPhotosAttributes,
  ) {
    const result = await this.database.Company.findAll({
      attributes: companyAttributes,
      where: {
        active: 1,
      },
      include: {
        model: this.database.Product,
        attributes: productAttributes,
        where: { active: 1 },
        required:false,
        include: [
          {
            model: this.database.ProductVariation,
            attributes: productVariationAttributes,
            where: { active: 1 },
            required:false,
          },
          {
            model: this.database.ProductPhoto,
            attributes: productPhotosAttributes,
            where: { active: 1 },
            required:false,
          },
        ],
      },
      raw: true,
    });
    
    const group = result.reduce((r, i) => {
      if (!(i.id in r)) {
        r[i.id] = {
          id: i.id,
          endpoint: i.endpoint,
          fantasy_name: i.fantasy_name,
          banner: i.banner,
          phone_number: i.phone_number,
          logo: i.logo,
          phone_country_code: i.phone_country_code,
          phone_area_code: i.phone_area_code,
          cep: i.cep,
          street: i.street,
          street_number: i.street_number,
          address_2: i.address_2,
          neighborhood: i.neighborhood,
          city: i.city,
          state: i.state,
          delivery_range: i.delivery_range,
          latitude: i.latitude,
          longitude: i.longitude,
          category: i.category,
          products: [],
        };
      }
      if (i['Products.id']) r[i.id].products.push({
        id: i['Products.id'],
        name: i['Products.name'],
        description: i['Products.description'],
        category: i['Products.category'],
        subcategory: i['Products.subcategory'],
        sort_id: i['Products.sort_id'],
        promotion: i['Products.promotion'],
        promotion_price: i['Products.promotion_price'],
        price: i['Products.price'],
        variationId: i['Products.ProductVariations.id'],
        variationColor: i['Products.ProductVariations.color'],
        variationSize: i['Products.ProductVariations.size'],
        photoId: i['Products.ProductPhotos.id'],
        photoPhoto_key: i['Products.ProductPhotos.photo_key'],
        photoThumbnail: i['Products.ProductPhotos.thumbnail'],
        photoIs_main: i['Products.ProductPhotos.is_main'],
      });
      return r;
    }, {});

    Object.entries(group).forEach(([key, i]) => {
      group[key].products = i.products.reduce((r, a) => {
        if (!(a.id in r)) {
          r[a.id] = {
            id: a.id,
            name: a.name,
            description: a.description,
            category: a.category,
            subcategory: a.subcategory,
            sort_id: a.sort_id,
            promotion: a.promotion,
            promotion_price: a.promotion_price,
            price: a.price,
            variationsPhotos: [],
          };
        }
        r[a.id].variationsPhotos.push({
          variationId: a.variationId,
          variationColor: a.variationColor,
          variationSize: a.variationSize,
          photoId: a.photoId,
          photoPhoto_key: a.photoPhoto_key,
          photoThumbnail: a.photoThumbnail,
          photoIs_main: a.photoIs_main,
        });
        return r;
      }, {});
    });

    Object.entries(group).forEach(([key, i]) => {
      Object.entries(i.products).forEach(([prodKey, prodI]) => {
        group[key].products[prodKey].variationsPhotos = prodI.variationsPhotos.reduce((r, a) => {
          if (!(a.variationId in r)) {
            r[a.variationId] = {
              id: a.variationId,
              color: a.variationColor,
              size: a.variationSize,
              photos: [],
            };
          }
          
          if (a.photoId) r[a.variationId].photos.push({
            id: a.photoId,
            photo_key: a.photoPhoto_key,
            thumbnail: a.photoThumbnail,
            is_main: a.photoIs_main,
          });
          return r;
        }, {});
      });
    });

    return Object.entries(group).map(([key, i]) => {
      group[key].products = Object.entries(i.products).map(([_prodKey, prodI]) => {
        group[key].products.variations = Object.entries(prodI.variationsPhotos).map(([_varKey, varI]) => {
          group[key].products.photos = varI.photos;
          return (varI.id) ? {
            id: varI.id, color: varI.color, size: varI.size
          } : null;
        });
        return {
          id: prodI.id,
          name: prodI.name,
          description: prodI.description,
          category: prodI.category,
          subcategory: prodI.subcategory,
          sort_id: prodI.sort_id,
          promotion: prodI.promotion,
          promotion_price: prodI.promotion_price,
          price: prodI.price,
          variations: (group[key].products.variations[0]) ? group[key].products.variations : [],
          photos: group[key].products.photos,
        };
      });
      return i;
    });
  }
};
