const Invoice = require("../models/Invoice");

const freeTrial = async (req, res) => {
    try {
        const invoiceData = {
            ...req.body,
            isFreeTrial: true,
        };

        const newInvoice = new Invoice(invoiceData);
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating free trial invoice' });
    }
};

const invoice = async (req, res) => {
    try {
        const newInvoice = new Invoice(req.body);
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating invoice' });
    }
}

const createInvoice = async (req, res) => {
    try {
        const invoiceData = {
            ...req.body,
            userId: req.user._id,
            isFreeTrial: false,
        };

        const newInvoice = new Invoice(invoiceData);
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating invoice' });
    }
};

const getInvoice = async (req, res) => {
    try {
        // Get page number and items per page from query params, defaulting to page 1 and 10 items per page
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

        // Calculate the skip value for pagination
        const skip = (page - 1) * itemsPerPage;

        // Query the invoices with pagination
        const invoices = await Invoice.find()
            .skip(skip) // Skip the appropriate number of documents
            .limit(itemsPerPage); // Limit to the specified number of items per page

        // Get the total count of invoices to calculate the total number of pages
        const totalInvoices = await Invoice.countDocuments();

        // Send response with invoices and pagination info
        res.status(200).json({
            invoices,
            pagination: {
                totalInvoices,
                totalPages: Math.ceil(totalInvoices / itemsPerPage),
                currentPage: page,
                itemsPerPage,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching invoices' });
    }
};


const getSingleInvoice = async (req, res) => {
    const { userId } = req.params;

    try {
        const invoices = await Invoice.find({ userId: userId });
        res.status(200).json(invoices);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching invoices' });
    }
}


const getUserInvoice = async (req, res) => {
    const { userId } = req.params;

    try {
        const invoices = await Invoice.find({ userId: userId });
        res.status(200).json(invoices);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching invoices' });
    }
}

const deleteSingleInvoice = async (req, res) => {
    try {
        // Get the invoiceId from the request parameters
        const { invoiceId } = req.params;

        // Delete the invoice by its invoiceId
        const result = await Invoice.findByIdAndDelete(invoiceId);
        console.log('result', result);

        if (!result) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Send success response
        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting invoice' });
    }
};


const deleteAllInvoices = async (req, res) => {
    try {
        // Delete all invoices from the database
        await Invoice.deleteMany();

        // Send success response
        res.status(200).json({ message: 'All invoices deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting invoices' });
    }
};




module.exports = {
    freeTrial, createInvoice, invoice, getInvoice, getSingleInvoice, getUserInvoice, deleteSingleInvoice, deleteAllInvoices
}