import { calculateMiles } from "../../src/services/miles-calculator-service";
import * as distanceService from "../../src/services/distances-calculator-service";
import { generateTrip } from "./factories/tripFactory";
import { ServiceClass, AffiliateStatus } from "../../src/protocols";

jest.mock("../../src/services/distances-calculator-service", () => ({
  calculateDistance: jest.fn(),
}));

describe("calculateMiles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 0 se a viagem for paga com milhas", () => {
    const trip = generateTrip({ miles: true });

    const result = calculateMiles(trip);

    expect(result).toBe(0);
  });

  it("deve calcular milhas corretamente para classe ECONOMIC + GOLD + fora de maio", () => {
    const trip = generateTrip({
      miles: false,
      service: ServiceClass.ECONOMIC,
      affiliate: AffiliateStatus.GOLD,
      date: "2025-06-10", // junho
    });

    (distanceService.calculateDistance as jest.Mock).mockReturnValue(1000);

    const result = calculateMiles(trip);

    // fórmula: 1000 * 1 (classe) + 25% de bônus = 1250 milhas
    expect(result).toBe(1250);
  });

  it("deve aplicar bônus de mês de aniversário (maio)", () => {
    const trip = generateTrip({
      miles: false,
      service: ServiceClass.ECONOMIC,
      affiliate: AffiliateStatus.BRONZE,
      date: "2025-05-20",
    });

    (distanceService.calculateDistance as jest.Mock).mockReturnValue(1000);

    const result = calculateMiles(trip);

    // 1000 base + 10% maio = 1100
    expect(result).toBe(1100);
  });

  it("deve aplicar todos os multiplicadores e bônus juntos", () => {
    const trip = generateTrip({
      miles: false,
      service: ServiceClass.FIRST_CLASS,
      affiliate: AffiliateStatus.PLATINUM,
      date: "2025-05-10", // maio
    });

    (distanceService.calculateDistance as jest.Mock).mockReturnValue(1000);

    // cálculo:
    // base = 1000
    // *2 (classe) = 2000
    // +50% (status) = 3000
    // +10% (maio) = 3300

    const result = calculateMiles(trip);

    expect(result).toBe(3300);
  });
});
