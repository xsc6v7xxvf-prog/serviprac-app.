import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cddzmkopxohwyiwrthck.supabase.co/rest/v1/'
const supabaseAnonKey = 'sb_publishable_kR4DuJm36kd7VMOtRY4DSw_3j3OtNEn'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
