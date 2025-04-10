import {
  calculateDistance,
  toRadius,
  applyHaversineFormula,
} from "../../src/services/distances-calculator-service";

describe("calculateDistance", () => {
  it("deve calcular distância entre São Paulo e Rio de Janeiro em KM", () => {
    const saoPaulo = { lat: -23.5505, long: -46.6333 };
    const rio = { lat: -22.9068, long: -43.1729 };

    const distance = calculateDistance(saoPaulo, rio);

    expect(distance).toBeGreaterThan(350);
    expect(distance).toBeLessThan(370);
    expect(distance).toBe(Math.round(distance));
  });

  it("deve calcular distância em MILHAS", () => {
    const saoPaulo = { lat: -23.5505, long: -46.6333 };
    const rio = { lat: -22.9068, long: -43.1729 };

    const distance = calculateDistance(saoPaulo, rio, true);

    expect(distance).toBeGreaterThan(215);
    expect(distance).toBeLessThan(230);
  });
});

describe("toRadius", () => {
  it("deve converter ângulo em graus para radianos", () => {
    const degrees = 180;
    const radians = toRadius(degrees);

    expect(radians).toBeCloseTo(Math.PI);
  });
});

describe("applyHaversineFormula", () => {
  it("deve aplicar a fórmula corretamente com valores simulados", () => {
    const lat1 = toRadius(-23.5505);
    const lat2 = toRadius(-22.9068);
    const dLat = toRadius(-22.9068 - -23.5505);
    const dLon = toRadius(-43.1729 - -46.6333);
    const radius = 6371;

    const result = applyHaversineFormula(lat1, lat2, dLat, dLon, radius);

    expect(Math.round(result)).toBeGreaterThan(350);
    expect(Math.round(result)).toBeLessThan(370);
  });
});
