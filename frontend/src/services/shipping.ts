import axios from "axios";
import { data } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/shipping"; // Thay đổi nếu backend chạy trên cổng khác

export const getProvinces = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/province`);
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

export const getDistricts = async (provinceId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/district`, {
      params: { provinceId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

export const getWards = async (districtId: number) => {
  try {
    console.log("dis", districtId);

    const response = await axios.get(`${API_BASE_URL}/ward`, {
      params: { districtId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching wards:", error);
    throw error;
  }
};


interface ShippingFeeParams {
  to_district_id: number;
  to_ward_code: string;
  weight: number;
}
export const getShippingFee = async ({ to_district_id, to_ward_code, weight }: ShippingFeeParams) => {
  try {
    console.log({ to_district_id, to_ward_code, weight });

    const response = await axios.get(`${API_BASE_URL}/fee`, {
      params: {
        to_district_id,
        to_ward_code,
        weight,
      }
    });
    console.log(response. data);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching shipping fee:", error);
    throw new Error("Không thể tính phí vận chuyển");
  }
};
