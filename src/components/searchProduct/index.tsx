import React, { useEffect, useState } from "react";

interface Product {
    id: string;
    title: string;
}

const SearchProduct: React.FC = () => {
    const [productId, setProductId] = useState<string>("");
    const [product, setProduct] = useState<Product>({ id: "", title: "" });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (productId) {
            const fetchproduct = async () => {
                setLoading(true);
                setError("");
                try {
                    const response = await fetch(`https://dummyjson.com/products/${productId}`);

                    if (response.status == 404) {
                        throw new Error("Product Not Found");
                    }

                    if (!response.ok) {
                        throw new Error("Network error has occured");
                    }
                    const data = await response.json();
                    setProduct({ id: data.id, title: data.title });
                    setLoading(false);
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message);
                        console.error(err);
                        setLoading(false);
                        setProduct({ id: "", title: "" });
                    }
                }
            };

            fetchproduct();
        }
    }, [productId]);

    return (
        <div>
            <input
                type="text"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="Enter product ID"
            />
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {error == "" && product.id !== "" && !loading && (
                <div>
                    <h1>{product.title}</h1>
                    <p>ID: {product.id}</p>
                </div>
            )}
        </div>
    );
};

export default SearchProduct;
