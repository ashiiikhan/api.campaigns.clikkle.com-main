import mongoose from 'mongoose';
import Campaign from '../../../schemas/Campaign.js';
import { pushNotification } from '../../../utilities/functions.js';

async function deleteCampaign(req, res, next) {
    let session;
    try {
        const { id: userId } = req.user;
        const { id } = req.params;

        const campaign = await Campaign.findOne({
            userId,
            _id: id,
        });

        if (!['ongoing', 'draft'].includes(campaign?.status)) {
            throw new Error('Completed campaigns cannot be deleted');
        }

        session = await mongoose.startSession();
        session.startTransaction();

        const deleted = await Campaign.deleteOne(campaign).session(session);

        if (!deleted.acknowledged) {
            throw new Error('Campaign cannot be deleted');
        }

        // deleting queue if campaign was ongoing
        if (campaign.status === 'ongoing') {
            // await deleteQueue(campaign, session); //bugFix
        }

        await session.commitTransaction();

        await pushNotification({
            userId,
            type: 'campaign',
            title: 'Campaign deleted',
            description: `A campaign ${campaign.name} has been deleted`,
        });

        return res.json({
            success: deleted.acknowledged,
            message: `${deleted.deletedCount} campaign deleted`,
        });
    } catch (err) {
        console.log(err);
        await session?.abortTransaction();
        next(err);
    } finally {
        await session?.endSession();
    }
}

async function deleteQueue(campaign, session) {
    const deleted = await Queue.deleteOne({ campaignId: campaign._id }).session(
        session
    );
    if (!deleted.acknowledged) {
        throw new Error('Campaign cannot be deleted');
    }
}

export default deleteCampaign;
