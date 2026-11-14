// The full current edition, for the embeddable chart and for links that ask for another week.
import { editie } from '../../../carburanti/date';

export const GET = () => new Response(JSON.stringify(editie), { headers: { 'Content-Type': 'application/json' } });
