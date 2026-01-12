'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Example component showing how to use Supabase
 * 
 * Common operations:
 * 
 * 1. Fetch data:
 *    const { data, error } = await supabase.from('table_name').select('*');
 * 
 * 2. Insert data:
 *    const { data, error } = await supabase.from('table_name').insert([{ column: 'value' }]);
 * 
 * 3. Update data:
 *    const { data, error } = await supabase.from('table_name').update({ column: 'value' }).eq('id', 1);
 * 
 * 4. Delete data:
 *    const { data, error } = await supabase.from('table_name').delete().eq('id', 1);
 * 
 * 5. Authentication:
 *    const { data, error } = await supabase.auth.signUp({ email, password });
 *    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
 *    const { error } = await supabase.auth.signOut();
 */

export default function SupabaseExample() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Example: Fetch from a table called 'patients'
            // Replace 'patients' with your actual table name
            const { data, error } = await supabase
                .from('patients')
                .select('*');

            if (error) throw error;

            setData(data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Supabase Data</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
