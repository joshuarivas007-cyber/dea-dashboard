// Mock data matching the spreadsheet structure
// In production, replace fetchStationData() with a real API call

const stations = {
  DQD2: {
    name: "DQD2",
    transporters: [
      { id: "A1KJYPBOUWF07", weeks: { 1: null, 2: 253, 3: 115, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: 121 }, grandTotal: 465, standing: "Great", slsTickets: "", comments: "" },
      { id: "A2X6FN8D6S5G6", weeks: { 1: 82, 2: null, 3: 7, 4: 46, 5: 9, 6: 21, 7: null, 8: 3, 9: 11, 10: null, 11: 85, 12: 82 }, grandTotal: 349, standing: "Fair", slsTickets: "", comments: "" },
      { id: "A6JOS360BOA06", weeks: { 1: 11, 2: null, 3: 19, 4: 5, 5: 20, 6: 10, 7: 72, 8: null, 9: 33, 10: 29, 11: 8, 12: 2 }, grandTotal: 317, standing: "Great", slsTickets: "", comments: "" },
      { id: "A3QLPG61X997X1", weeks: { 1: 2, 2: 4, 3: null, 4: null, 5: null, 6: null, 7: null, 8: 1, 9: null, 10: 54, 11: 121, 12: null }, grandTotal: 297, standing: "Unacceptable", slsTickets: "https://t.corp.amazon.com/P418917880/communication", comments: "In Progress" },
      { id: "A2U4ZX96VZ5TCU", weeks: { 1: null, 2: 17, 3: 4, 4: null, 5: 100, 6: 1, 7: 1, 8: null, 9: 76, 10: 5, 11: null, 12: 72 }, grandTotal: 291, standing: "Great", slsTickets: "", comments: "" }
    ],
    total: 1723
  },
  XGC1: {
    name: "XGC1",
    transporters: [
      { id: "AAEG13L33K9A7", weeks: { 1: null, 2: null, 3: 1, 4: 36, 5: 9, 6: null, 7: 4, 8: 150, 9: 5, 10: 71, 11: 37, 12: 5 }, grandTotal: 384, standing: "Unacceptable", slsTickets: "https://t.corp.amazon.com/P244249067/communication", comments: "In Progress" },
      { id: "A3D5RN6V2UPWV3", weeks: { 1: 3, 2: 43, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: 2, 11: 110, 12: null }, grandTotal: 350, standing: "Great", slsTickets: "", comments: "" },
      { id: "A3BKVOV2VNWA0U", weeks: { 1: 22, 2: null, 3: null, 4: null, 5: null, 6: null, 7: 96, 8: null, 9: null, 10: null, 11: null, 12: null }, grandTotal: 236, standing: "At risk", slsTickets: "", comments: "" },
      { id: "A2OUUV54DQQE0I", weeks: { 1: null, 2: 1, 3: null, 4: 65, 5: 22, 6: null, 7: 4, 8: null, 9: null, 10: 38, 11: 6, 12: 2 }, grandTotal: 188, standing: "At risk", slsTickets: "", comments: "" },
      { id: "A22TiY7UKTl6M0", weeks: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: 11, 9: null, 10: 21, 11: 50, 12: 30 }, grandTotal: 175, standing: "Unacceptable", slsTickets: "", comments: "" }
    ],
    total: 1609
  },
  DNS6: {
    name: "DNS6",
    transporters: [
      { id: "A2VBGG5HZT4PN7", weeks: { 1: null, 2: null, 3: 109, 4: null, 5: 111, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null }, grandTotal: 335, standing: "Fair", slsTickets: "", comments: "" },
      { id: "A1O66FP91Q7VUI2", weeks: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: 3, 10: null, 11: 285, 12: 3 }, grandTotal: 291, standing: "Fantastic", slsTickets: "", comments: "" },
      { id: "AX9Z0SWEYUMUV", weeks: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: 2, 7: null, 8: null, 9: null, 10: 58, 11: 4, 12: null }, grandTotal: 200, standing: "Fair", slsTickets: "", comments: "" },
      { id: "A3SXBN1BLBXS25", weeks: { 1: null, 2: 56, 3: 3, 4: 6, 5: 4, 6: null, 7: 70, 8: 2, 9: 5, 10: null, 11: null, 12: null }, grandTotal: 182, standing: "At risk", slsTickets: "", comments: "" },
      { id: "A1AX09S71XZYN6", weeks: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: 176, 9: null, 10: null, 11: null, 12: null }, grandTotal: 176, standing: "Great", slsTickets: "", comments: "" }
    ],
    total: 1184
  },
  DNS5: {
    name: "DNS5",
    transporters: [
      { id: "A5PZ0YLO3Q0R9V", weeks: { 1: null, 2: 35, 3: null, 4: 1, 5: 24, 6: null, 7: null, 8: 2, 9: 1, 10: 99, 11: null, 12: null }, grandTotal: 331, standing: "At risk", slsTickets: "", comments: "" },
      { id: "A2D1YF6CL03VC34", weeks: { 1: null, 2: null, 3: null, 4: null, 5: 84, 6: null, 7: 4, 8: null, 9: null, 10: 77, 11: null, 12: 74 }, grandTotal: 303, standing: "At risk", slsTickets: "", comments: "" },
      { id: "A1DI256K146G2Z", weeks: { 1: null, 2: 1, 3: null, 4: 99, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: 1, 12: null }, grandTotal: 158, standing: "Great", slsTickets: "", comments: "" },
      { id: "A3TG4MUU1L6ZQY1", weeks: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: 1, 11: 55, 12: 1 }, grandTotal: 130, standing: "Great", slsTickets: "", comments: "" },
      { id: "A3SLGQABG3WK5D", weeks: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: 109, 8: null, 9: null, 10: null, 11: null, 12: null }, grandTotal: 110, standing: "Fantastic", slsTickets: "", comments: "" }
    ],
    total: 1032
  },
  XNC1: {
    name: "XNC1",
    transporters: [
      { id: "A3RPDKZJTM2HFT", weeks: { 1: 32, 2: 70, 3: null, 4: 63, 5: 67, 6: 63, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null }, grandTotal: 295, standing: "Unacceptable", slsTickets: "", comments: "Offboarded" },
      { id: "A1ZYDFBLZRDUOI", weeks: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: 2, 9: null, 10: null, 11: null, 12: 164 }, grandTotal: 226, standing: "Great", slsTickets: "", comments: "" },
      { id: "A3BFZND7ZN0QW", weeks: { 1: 46, 2: null, 3: 52, 4: 41, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null }, grandTotal: 176, standing: "Fair", slsTickets: "", comments: "" },
      { id: "ATDO6GK8OW9T", weeks: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: 80, 9: null, 10: 45, 11: null, 12: null }, grandTotal: 125, standing: "Fantastic", slsTickets: "", comments: "" },
      { id: "A2RW0BV3GRV3RN", weeks: { 1: null, 2: null, 3: null, 4: null, 5: 2, 6: null, 7: 2, 8: null, 9: null, 10: null, 11: null, 12: 114 }, grandTotal: 118, standing: "Fair", slsTickets: "", comments: "" }
    ],
    total: 940
  },
  DNS4: {
    name: "DNS4",
    transporters: [
      { id: "A1L5EE4P648L0N", weeks: { 1: null, 2: 3, 3: null, 4: 2, 5: 1, 6: 2, 7: 1, 8: 2, 9: 1, 10: null, 11: 67, 12: 1 }, grandTotal: 150, standing: "Unacceptable", slsTickets: "", comments: "Offboarded" },
      { id: "A1AH00XAFU46G2I", weeks: { 1: 67, 2: 80, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null }, grandTotal: 150, standing: "Fantastic", slsTickets: "", comments: "" },
      { id: "A1OCKK85SV01AH", weeks: { 1: 9, 2: null, 3: 7, 4: 6, 5: 79, 6: 2, 7: 2, 8: 8, 9: 2, 10: null, 11: 3, 12: 2 }, grandTotal: 143, standing: "Fantastic", slsTickets: "", comments: "" },
      { id: "A3LMMUGXMP89UP", weeks: { 1: 47, 2: null, 3: 1, 4: null, 5: 79, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null }, grandTotal: 127, standing: "Unacceptable", slsTickets: "", comments: "Offboarded" },
      { id: "A32M2LR5IH2ZPX", weeks: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: 1, 10: 75, 11: null, 12: null }, grandTotal: 126, standing: "Fantastic", slsTickets: "", comments: "" }
    ],
    total: 696
  },
  XWG1: {
    name: "XWG1",
    transporters: [
      { id: "A2W6MAL3BH4K4B", weeks: { 1: null, 2: null, 3: 101, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null }, grandTotal: 101, standing: "At risk", slsTickets: "", comments: "" },
      { id: "A3R96GFOB72ITV", weeks: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: 2, 7: 1, 8: 3, 9: 54, 10: null, 11: 29, 12: null }, grandTotal: 93, standing: "Great", slsTickets: "", comments: "" },
      { id: "A3E4H4Y85M58E56", weeks: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: 3, 11: null, 12: 78 }, grandTotal: 81, standing: "At risk", slsTickets: "", comments: "" },
      { id: "A6UHZM2BN6W4P51", weeks: { 1: null, 2: 1, 3: 2, 4: null, 5: 7, 6: 4, 7: null, 8: 8, 9: 4, 10: null, 11: null, 12: 10 }, grandTotal: 80, standing: "Unacceptable", slsTickets: "", comments: "" },
      { id: "A3V2VZ43VUT2ZL", weeks: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: 64, 10: null, 11: null, 12: null }, grandTotal: 64, standing: "Fantastic", slsTickets: "", comments: "" }
    ],
    total: 419
  }
};

export async function fetchStationData() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return stations;
}

export function getStandingColor(standing) {
  switch (standing) {
    case "Fantastic": return { bg: "#2e7d32", text: "#fff" };
    case "Great": return { bg: "#4caf50", text: "#fff" };
    case "Fair": return { bg: "#ff9800", text: "#000" };
    case "At risk": return { bg: "#f44336", text: "#fff" };
    case "Unacceptable": return { bg: "#b71c1c", text: "#fff" };
    default: return { bg: "#757575", text: "#fff" };
  }
}
