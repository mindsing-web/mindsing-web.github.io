(function() {
  try{
    var f = document.createElement("iframe");

      var ifrmSrc = 'https://forms.zohopublic.com/briandaninmind1/form/MindSingUpdatesSubscription/formperma/gnTMhpfkoaq53ZgcX4YPIkqN04T2FfPLPV5NhcXHlBA?zf_rszfm=1';


        try{
      if ( typeof ZFAdvLead != "undefined" && typeof zfutm_zfAdvLead != "undefined" ) {
        for( var prmIdx = 0 ; prmIdx < ZFAdvLead.utmPNameArr.length ; prmIdx ++ ) {
            var utmPm = ZFAdvLead.utmPNameArr[ prmIdx ];
            utmPm = ( ZFAdvLead.isSameDomian && ( ZFAdvLead.utmcustPNameArr.indexOf(utmPm) == -1 ) ) ? "zf_" + utmPm : utmPm;
            var utmVal = zfutm_zfAdvLead.zfautm_gC_enc( ZFAdvLead.utmPNameArr[ prmIdx ] );
            if ( typeof utmVal !== "undefined" ) {
              if ( utmVal != "" ) {
                if(ifrmSrc.indexOf('?') > 0){
                     ifrmSrc = ifrmSrc+'&'+utmPm+'='+utmVal;
                }else{
                    ifrmSrc = ifrmSrc+'?'+utmPm+'='+utmVal;
                }
              }
            }
        }
      }
      if ( typeof ZFLead !== "undefined" && typeof zfutm_zfLead !== "undefined" ) {
        for( var prmIdx = 0 ; prmIdx < ZFLead.utmPNameArr.length ; prmIdx ++ ) {
            var utmPm = ZFLead.utmPNameArr[ prmIdx ];
            var utmVal = zfutm_zfLead.zfutm_gC_enc( ZFLead.utmPNameArr[ prmIdx ] );
            if ( typeof utmVal !== "undefined" ) {
              if ( utmVal != "" ){
                if(ifrmSrc.indexOf('?') > 0){
                  ifrmSrc = ifrmSrc+'&'+utmPm+'='+utmVal;//No I18N
                }else{
                  ifrmSrc = ifrmSrc+'?'+utmPm+'='+utmVal;//No I18N
                }
              }
            }
          }
      }
    }catch(e){}

    f.src = ifrmSrc;
    f.style.border="none";
    f.style.height="417px";
    f.style.width="90%";
    f.style.margin="0 auto";
    f.style.display="block";
    f.style.transition="all 0.5s ease";
    f.setAttribute("aria-label", 'MindSing Updates Subscription');

    var d = document.getElementById("zf_div_gnTMhpfkoaq53ZgcX4YPIkqN04T2FfPLPV5NhcXHlBA");
    d.appendChild(f);
    window.addEventListener('message', function (){
      var evntData = event.data;
      if( evntData && evntData.constructor == String ){
        var zf_ifrm_data = evntData.split("|");
        if ( zf_ifrm_data.length == 2 || zf_ifrm_data.length == 3 ) {
          var zf_perma = zf_ifrm_data[0];
          var zf_ifrm_ht_nw = ( parseInt(zf_ifrm_data[1], 10) + 15 ) + "px";
          var iframe = document.getElementById("zf_div_gnTMhpfkoaq53ZgcX4YPIkqN04T2FfPLPV5NhcXHlBA").getElementsByTagName("iframe")[0];
          if ( (iframe.src).indexOf('formperma') > 0 && (iframe.src).indexOf(zf_perma) > 0 ) {
            var prevIframeHeight = iframe.style.height;
            var zf_tout = false;
            if( zf_ifrm_data.length == 3 ) {
                iframe.scrollIntoView();
                zf_tout = true;
            }

            if ( prevIframeHeight != zf_ifrm_ht_nw ) {
              if( zf_tout ) {
                  setTimeout(function(){
                      iframe.style.height = zf_ifrm_ht_nw;
                  },500);
              } else {
                  iframe.style.height = zf_ifrm_ht_nw;
              }
            }
          }
        }
      }
    }, false);
    }catch(e){}
})();
