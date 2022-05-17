import { toast } from '@zerodevx/svelte-toast';

export const toastSuccess = (text) => toast.push(text ?? 'Success!', {
    theme: {
    '--toastBackground': '#48BB78',
    '--toastBarBackground': '#2F855A'
    }
    });

export const toastFailed = (text) => toast.push(text ?? 'Whoops! Your request failed', {
    theme: {
    '--toastBackground': '#F56565',
    '--toastBarBackground': '#C53030'
    }
    });