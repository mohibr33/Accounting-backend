const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();

const { hasPermission } = require('@/middlewares/permission');
const appControllers = require('@/controllers/appControllers');
const { routesList } = require('@/models/utils');

const { calculate: calculateInflow } = require('./extraControllers/inflow');
const { calculate: calculateOutflow, filterExpensesByDate } = require('./extraControllers/outflow');

const routerApp = (entity, controller) => {
  // Advanced routes
  router.get('/inflow/calculate', calculateInflow);
  router.get('/outflow/calculate', calculateOutflow);
  
  // Add the new filter route
  router.route('/outflow/filter').get(hasPermission('read'), catchErrors(filterExpensesByDate));

  router
    .route(`/${entity}/create`)
    .post(hasPermission('create'), catchErrors(controller['create']));
  // ... (rest of the routes)
};

routesList.forEach(({ entity, controllerName }) => {
  const controller = appControllers[controllerName];
  routerApp(entity, controller);
});

module.exports = router;
