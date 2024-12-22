import { Request, Response } from "express";
import { Model } from "mongoose";

export interface authenticatedRequest extends Request {
    userId: string
}

abstract class BaseController<T> {
    model: Model<T>;
    constructor(model: any) {
        this.model = model;
    }

    abstract getAll(req: Request, res: Response): Promise<void>;

    async getByIdInternal(itemId) {
        try {
            const item = await this.model.findById(itemId);
            return item;
            
        } catch (error) {
            return error
        }
    };

    async getById(req: Request, res: Response) {
        const id = req.params.id;

        try {
            const item = await this.getByIdInternal(id);
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
            console.error(error)
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

    async delete(req: authenticatedRequest, res: Response, userId) {
        try {
            const authenticatedUserId = req.params.userId; // ID of the logged-in user
            // const ItemId = req.body.ownerId; // ID of the item to delete from the route

            // Ensure that only the authenticated user can delete their Items
            if (authenticatedUserId !== userId){
                res.status(403).send('Forbbiden');
            } else {
                const deletedItem = await this.model.findByIdAndDelete(req.params.id);

                if (!deletedItem) res.status(404).json({ message: 'Not found' });
                res.status(200).json(deletedItem);
            }
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    };
}

export default BaseController