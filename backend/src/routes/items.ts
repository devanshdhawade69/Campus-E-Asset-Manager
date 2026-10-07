import { Router, Request, Response } from 'express';
import { Item } from '../models/Item';
import { authGuard } from '../middleware/auth';
import csvParser from 'csv-parser';
import { createObjectCsvStringifier } from 'csv-writer';
import { Readable } from 'stream';

const router = Router();

// In‑memory store for demo (replace with DB later)
let items: Item[] = [];
let nextId = 1;

// GET all items
router.get('/', authGuard, (req: Request, res: Response) => {
  res.json(items);
});

// POST new item
router.post('/', authGuard, (req: Request, res: Response) => {
  const item: Item = { ...req.body, _id: (nextId++).toString() };
  items.push(item);
  res.status(201).json(item);
});

// PUT update item
router.put('/:id', authGuard, (req: Request, res: Response) => {
  const {id} = req.params;
  const index = items.findIndex(i => i._id === id);
  if (index === -1) return res.status(404).json({msg:'Not found'});
  items[index] = { ...items[index], ...req.body };
  res.json(items[index]);
});

// DELETE item
router.delete('/:id', authGuard, (req: Request, res: Response) => {
  const {id} = req.params;
  const before = items.length;
  items = items.filter(i => i._id !== id);
  if (items.length === before) return res.status(404).json({msg:'Not found'});
  res.status(204).send();
});

// CSV import (expects multipart/form-data with field 'file')
router.post('/import', authGuard, async (req: Request, res: Response) => {
  // simplistic: assume raw CSV body (no file upload handling library)
  const csv = req.body.csv as string;
  if (!csv) return res.status(400).json({msg:'CSV payload required'});
  const records: any[] = [];
  const stream = Readable.from([csv]);
  stream.pipe(csvParser({ headers: true }))
    .on('data', (data) => records.push(data))
    .on('end', () => {
      records.forEach(rec => {
        const item: Item = { ...rec, _id: (nextId++).toString() };
        items.push(item);
      });
      res.json({imported: records.length});
    })
    .on('error', err => res.status(500).json({msg: err.message}));
});

// CSV export
router.get('/export', authGuard, (req: Request, res: Response) => {
  const csvStringifier = createObjectCsvStringifier({
    header: [
      {id:'deviceType', title:'Device Type'},
      {id:'serialNumber', title:'Serial Number'},
      {id:'condition', title:'Condition'},
      {id:'disposalMethod', title:'Disposal Method'},
      {id:'additionalNotes', title:'Additional Notes'},
      {id:'location', title:'Location'},
      {id:'responsibleDept', title:'Responsible Dept'}
    ]
  });
  const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(items);
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});

export default router;
