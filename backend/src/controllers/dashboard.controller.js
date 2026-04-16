import { getDashboardSummary } from "../services/dashboard.service.js";

export const getDashboardSummaryController = async (req, res) => {
  try {
    const summary = await getDashboardSummary();

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard summary",
    });
  }
};
