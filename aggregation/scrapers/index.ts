import mailtemp_uk from './mailtemp-uk';
import tmp_mail_io from './temp-mail-io';
import tempmail_so from './tempmail-so';
import tmpmailo_com from './tempmailo-com';


(async ()=>{
    
    await mailtemp_uk();
    await tmp_mail_io();
    await tempmail_so();
    await tmpmailo_com();
    
    console.log('All scrapers completed successfully.');

    // Exit the process after all scrapers have completed
    process.exit(0);

})()