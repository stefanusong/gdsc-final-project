const { buildResp } = require('../helpers/response.helper');
const Category = require('../models/category.model');
const Post = require('../models/post.model');

const addCategory = (req, res) => {
    const { categoryName } = req.body;

    const newCategory = new Category({
        categoryName
    });

    newCategory.save()
        .then(category => {
            let response = buildResp(201, "Category added successfully !", { categoryId: category._id, categoryName: category.categoryName }, []);
            res.status(201).send(response);
        })
        .catch(err => {
            let response = buildResp(400, "Failed to create category", [], err);
            res.status(400).send(response);
        });
}

const getAllCategories = (req, res) => {
    Category.find()
        .then(categories => {
            if (categories.length === 0) {
                let response = buildResp(200, "The category is still empty", [], []);
                res.status(200).send(response);
            } else {
                categories = categories.map(category => {
                    return {
                        categoryName: category.categoryName,
                        href: `http://localhost:3000/api/v1/categories/${category._id}`
                    }
                });

                let response = buildResp(200, "Successfuly get all categories", categories, []);
                response.totalPosts = categories.length;
                res.status(200).send(response);
            }
        })
        .catch(err => {
            let response = buildResp(400, "Failed to get categories", [], err);
            res.status(400).send(response);
        });
}

const getCategoryById = (req, res) => {
    const { categoryId } = req.params;

    Category.findById(categoryId)
        .then(category => {
            if (!category) {
                let response = buildResp(404, "Category not found", [], []);
                res.status(404).send(response);
            } else {
                // Find posts by categoryId
                Post.find({ categoryId: categoryId })
                    .then(posts => {
                        let response = buildResp(200, "Successfuly get category", { categoryName: category.categoryName }, []);
                        response.data.posts = posts;
                        res.status(200).send(response);
                    })
                    .catch(err => {
                        let response = buildResp(400, "Failed to get posts by category id", [], err);
                        res.status(400).send(response);
                    });
            }
        })
        .catch(err => {
            let response = buildResp(400, "Failed to get category", [], err);
            res.status(400).send(response);
        });
}

module.exports = {
    addCategory,
    getAllCategories,
    getCategoryById
}