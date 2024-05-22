// SearchProduct.test.tsx
import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import SearchProduct from "../components/searchProduct";

global.fetch = jest.fn();

describe("SearchProduct", () => {
    beforeEach(() => {
        // Reset fetch mock before each test
        jest.resetAllMocks();
    });

    test("displays loading state initially when input is provided", async () => {
        const mockProductData = { id: "3", title: "Samsung Universe 9" };

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockProductData),
        });
        render(<SearchProduct />);

        const input = screen.getByPlaceholderText("Enter product ID");
        act(() => {
            userEvent.type(input, "123");
        });
        expect(screen.getByText("Loading...")).toBeInTheDocument();

        // await waitFor(() => expect(screen.getByText("Loading...")).toBeInTheDocument());
    });

    test("fetches and displays product data when input is provided", async () => {
        const mockProductData = { id: "11", title: "Samsung Universe 11" };

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockProductData),
        });

        render(<SearchProduct />);
        const input = screen.getByPlaceholderText("Enter product ID");

        await act(async () => {
            userEvent.type(input, "3");
        });

        await waitFor(() => expect(screen.getByText("Samsung Universe 11")).toBeInTheDocument());
    });

    test("logs an error message to console and display in screen when fetch fails", async () => {
        global.fetch = jest.fn();
        // let consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        let consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        const mockError = new Error("Product Not Found");
        global.fetch = jest.fn().mockRejectedValueOnce(mockError);

        render(<SearchProduct />);
        const input = screen.getByPlaceholderText("Enter product ID");

        await act(async () => {
            userEvent.type(input, "3");
        });

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
            expect(screen.getByText("Error: Product Not Found")).toBeInTheDocument();
        });
    });

    test("logs an error 404", async () => {
        global.fetch = jest.fn();
        let consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: false,
            status: 404,
        });

        render(<SearchProduct />);
        const input = screen.getByPlaceholderText("Enter product ID");
        act(() => {
            userEvent.type(input, "512");
        });

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(new Error("Product Not Found"));
            expect(screen.getByText("Error: Product Not Found")).toBeInTheDocument();
        });
    });
});
