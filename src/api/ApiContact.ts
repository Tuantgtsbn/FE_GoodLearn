import { type ContactDataDto } from '@dto/contact.dto';
import { fetcher } from './Fetcher';
import { type IContact } from 'src/types';

const path = {
    baseContact: '/contacts',
    sendContact: '/contacts',
    adminGetContacts: '/contacts',
};

const sendContact = (data: ContactDataDto) => {
    return fetcher<IContact>({
        url: path.sendContact,
        method: 'POST',
        data,
    });
};

export default {
    sendContact,
};