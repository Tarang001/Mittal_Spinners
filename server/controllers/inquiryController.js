import * as inquiryService from "../services/inquiryService.js";
import { sendSuccess } from "../utils/response.js";

export async function create(req, res, next) {
  try {
    const inquiry = await inquiryService.createInquiry(req.body || {});
    return sendSuccess(res, { inquiryId: inquiry.id }, 201);
  } catch (error) {
    return next(error);
  }
}
