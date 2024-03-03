import prisma from "../DB/db.config.js";

export const getAllProducts = async (req, res) => {
  let products;
  try {
    if(req.role === "ADMIN"){
        products = await prisma.product.findMany();
    } else {
        products = await prisma.product.findMany({
        where: { created_by_id: req.userId },
      });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const getProductById = async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    const product = await prisma.product.findUnique({
      where: { pd_id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createProduct = async (req, res) => {
  const { pd_name, pd_price } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        pd_name,
        pd_price,
        created_by_id: req.userId,
      },
    });

    res.status(201).json("Product created successfuly");
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const productId = parseInt(req.params.id);
  const { pd_name, pd_price } = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { pd_id: productId },
      data: {
        pd_name,
        pd_price,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    const deletedProduct = await prisma.product.delete({
      where: { pd_id: productId },
    });

    res.json({msg: "Product deleted successfuly", deletedProduct});
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
