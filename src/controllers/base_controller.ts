import { Request, Response } from "express";
import { Model } from "mongoose";

abstract class BaseController<T> {
    model: Model<T>;
    constructor(model: any) {
        this.model = model;
    }

    abstract getAll(req: Request, res: Response): Promise<void>;

    async getById(req: Request, res: Response) {
        const id = req.params.id;

        try {
            const item = await this.model.findById(id);
            if (item != null) {
                res.send(item);
            } else {
                res.status(404).send("Not found");
            }
        } catch (error) {
            res.status(400).send(error);
        }
    };

    async create(req: Request, res: Response) {
        const body = req.body;
        try {
            const item = await this.model.create(body);
            res.status(201).send(item);
        } catch (error) {
            res.status(400).send(error);
        }
    };

    async update(req: Request, res: Response) {
        try {
            const updatedItem = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedItem) return res.status(404).json({ message: 'Not found' });
            res.status(200).json(updatedItem);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    };

    async delete(req: Request, res: Response) {
        try {
            const deletedItem = await this.model.findByIdAndDelete(req.params.id);
            if (!deletedItem) return res.status(404).json({ message: 'Not found' });
            res.status(200).json(deletedItem);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    };
}

export default BaseController