import * as workerService from "../services/workerService.js";
import { sendSuccess } from "../utils/response.js";

export async function list(req, res, next) {
  try {
    const data = await workerService.listWorkers();
    return sendSuccess(res, data);
  } catch (error) {
    return next(error);
  }
}

export async function create(req, res, next) {
  try {
    const data = await workerService.createWorker(req.body || {});
    return sendSuccess(res, data, 201);
  } catch (error) {
    return next(error);
  }
}

export async function update(req, res, next) {
  try {
    const data = await workerService.updateWorker(req.params.id, req.body || {});
    return sendSuccess(res, data);
  } catch (error) {
    return next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await workerService.deleteWorker(req.params.id);
    return sendSuccess(res, true);
  } catch (error) {
    return next(error);
  }
}
