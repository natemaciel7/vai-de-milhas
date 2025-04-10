import * as milesService from "../../src/services/miles-service";
import { milesRepository } from "./mocks/milesRepository.ts";
import * as milesCalculator from "../../src/services/miles-calculator-service";
import { generateTrip } from "./factories/tripFactory";

jest.mock("../../src/repositories/miles-repository", () => ({
  findMiles: (...args) => milesRepository.findMiles(...args),
  saveMiles: (...args) => milesRepository.saveMiles(...args),
}));

jest.mock("../../src/services/miles-calculator-service", () => ({
  calculateMiles: jest.fn(),
}));

describe("miles-service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateMilesForTrip", () => {
    it("deve lançar erro se o código da viagem já existir", async () => {
      const trip = generateTrip();
      milesRepository.findMiles.mockResolvedValueOnce({
        code: trip.code,
        miles: 999,
      });

      const promise = milesService.generateMilesForTrip(trip);

      await expect(promise).rejects.toEqual({
        type: "conflict",
        message: `Miles already registered for code ${trip.code}`,
      });
    });

    it("deve calcular e salvar milhas para viagem nova", async () => {
      const trip = generateTrip();
      milesRepository.findMiles.mockResolvedValueOnce(null);
      (milesCalculator.calculateMiles as jest.Mock).mockReturnValue(1234);
      milesRepository.saveMiles.mockResolvedValueOnce(undefined);

      const result = await milesService.generateMilesForTrip(trip);

      expect(milesRepository.findMiles).toHaveBeenCalledWith(trip.code);
      expect(milesCalculator.calculateMiles).toHaveBeenCalledWith(trip);
      expect(milesRepository.saveMiles).toHaveBeenCalledWith(trip.code, 1234);
      expect(result).toBe(1234);
    });
  });

  describe("getMilesFromCode", () => {
    it("deve lançar erro se código não for encontrado", async () => {
      milesRepository.findMiles.mockResolvedValueOnce(null);

      const promise = milesService.getMilesFromCode("XYZ123");

      await expect(promise).rejects.toEqual({
        type: "not_found",
        message: `Miles not found for code XYZ123`,
      });
    });

    it("deve retornar milhas se código existir", async () => {
      milesRepository.findMiles.mockResolvedValueOnce({
        id: 1,
        code: "XYZ123",
        miles: 4567,
      });

      const result = await milesService.getMilesFromCode("XYZ123");

      expect(result).toEqual({ id: 1, code: "XYZ123", miles: 4567 });
    });
  });
});
