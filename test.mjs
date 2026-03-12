import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aqvpbhfvutksqtzmrigq.supabase.co'
const supabaseKey = 'sb_publishable_cuKK8Z3aGYiJCafGwE_9CA_iBixM4sm'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data, error } = await supabase.from('barbershops').select('name, images')
  console.log(JSON.stringify(data, null, 2))
}

run()
