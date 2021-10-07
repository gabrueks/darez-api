const { Router } = require('express');
const { wrap } = require('@awaitjs/express');
const { httpRequest } = require('../../../infrastructure/adapters/http');
const {
  create, findCompanies, findCompaniesRegion, findNeighborhood, update, updateBanner, updateLogo,
  deleteBanner, deleteLogo, findAllProducts, findMainCompany, findProductsFromCategoryCompany,
  getBanner, findOneCompany, findOneNoLogin, findOneEndpoint, findEndpoints, findAllCategory,
  getPaymentMethods, getLogo, findOneLinkou,
} = require('../../../web/v1/companies');
const { createVisit, findVisits } = require('../../../web/v1/visits');
const {
  validate, authenticate, authorize, upload, base64validate, resizeImageMiddleware,
} = require('../middlewares');
const {
  NewCompanySchema, NewVisitSchema, UpdateCompanySchema, UpdateLogoBannerSchema,
} = require('../../../web/v1/schemas');
const {
  logoHeight, logoLength, logoQuality, bannerHeight, bannerLength, bannerQuality,
} = require('../helpers');

module.exports = Router()
  .get('/admin/companies', wrap(authenticate), wrap(authorize('get_all_companies')), async (req, res) => {
    const { statusCode, data } = await findCompanies(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/admin/companies/:ID', wrap(authenticate), wrap(authorize('get_one_company')), async (req, res) => {
    const { statusCode, data } = await findOneCompany(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/admin/companies/:ID', wrap(authenticate), wrap(authorize('update_companies')), validate(UpdateCompanySchema), async (req, res) => {
    const { statusCode, data } = await update(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/admin/companies/:ID/images/banner', wrap(authenticate), wrap(authorize('update_companies_banner')), upload.single('file'), wrap(resizeImageMiddleware(bannerLength, bannerHeight, bannerQuality)),
    async (req, res) => {
      const { statusCode, data } = await updateBanner(httpRequest(req));
      return res.status(statusCode).json(data);
    })
  .put('/admin/companies/:ID/images/logo', wrap(authenticate), wrap(authorize('update_companies_logo')), upload.single('file'), wrap(resizeImageMiddleware(logoLength, logoHeight, logoQuality)),
    async (req, res) => {
      const { statusCode, data } = await updateLogo(httpRequest(req));
      return res.status(statusCode).json(data);
    })
  .delete('/admin/companies/:ID/images/banner', wrap(authenticate), wrap(authorize('delete_companies_banner')), async (req, res) => {
    const { statusCode, data } = await deleteBanner(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .delete('/admin/companies/:ID/images/logo', wrap(authenticate), wrap(authorize('delete_companies_logo')), async (req, res) => {
    const { statusCode, data } = await deleteLogo(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .post('/companies', wrap(authenticate), validate(NewCompanySchema), async (req, res) => {
    const { statusCode, data } = await create(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/companies', wrap(authenticate), validate(UpdateCompanySchema), async (req, res) => {
    const { statusCode, data } = await update(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/companies/endpoint/:endpoint', async (req, res) => {
    const { statusCode, data } = await findOneEndpoint(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/companies/linkou/:endpoint', async (req, res) => {
    const { statusCode, data } = await findOneLinkou(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/companies/endpoints', async (req, res) => {
    const { statusCode, data } = await findEndpoints(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/companies', wrap(authenticate), async (req, res) => {
    const { statusCode, data } = await findOneCompany(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/companies/products', async (req, res) => {
    const { statusCode, data } = await findAllProducts(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/companies/visits', wrap(authenticate), wrap(authorize('get_company_visits')), async (req, res) => {
    const { statusCode, data } = await findVisits(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .post('/companies/visits', validate(NewVisitSchema), async (req, res) => {
    const { statusCode, data } = await createVisit(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/companies/products/categories/:category', async (req, res) => {
    const { statusCode, data } = await findProductsFromCategoryCompany(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/companies/images/banner', async (req, res) => {
    const { statusCode, data } = await getBanner(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/companies/images/logo', async (req, res) => {
    const { statusCode, data } = await getLogo(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/companies/images/banner', wrap(authenticate), upload.single('file'), wrap(resizeImageMiddleware(bannerLength, bannerHeight, bannerQuality)), async (req, res) => {
    const { statusCode, data } = await updateBanner(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/app/companies/images/banner', wrap(authenticate), validate(UpdateLogoBannerSchema), wrap(base64validate), wrap(resizeImageMiddleware(bannerLength, bannerHeight, bannerQuality)), async (req, res) => {
    const { statusCode, data } = await updateBanner(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/companies/images/logo', wrap(authenticate), upload.single('file'), wrap(resizeImageMiddleware(logoLength, logoHeight, logoQuality)), async (req, res) => {
    const { statusCode, data } = await updateLogo(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/app/companies/images/logo', wrap(authenticate), validate(UpdateLogoBannerSchema), wrap(base64validate), wrap(resizeImageMiddleware(logoLength, logoHeight, logoQuality)), async (req, res) => {
    const { statusCode, data } = await updateLogo(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .delete('/companies/images/banner', wrap(authenticate), async (req, res) => {
    const { statusCode, data } = await deleteBanner(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .delete('/companies/images/logo', wrap(authenticate), async (req, res) => {
    const { statusCode, data } = await deleteLogo(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/companies/geo-distance', async (req, res) => {
    const { statusCode, data } = await findCompaniesRegion(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/companies/category/:category', async (req, res) => {
    const { statusCode, data } = await findAllCategory(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/companies/mainshop', async (req, res) => {
    const { statusCode, data } = await findMainCompany(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/companies/:ID', async (req, res) => {
    const { statusCode, data } = await findOneNoLogin(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/companies/:ID/payments', async (req, res) => {
    const { statusCode, data } = await getPaymentMethods(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/neighborhoods', async (req, res) => {
    const { statusCode, data } = await findNeighborhood(httpRequest(req));
    return res.status(statusCode).json(data);
  });
