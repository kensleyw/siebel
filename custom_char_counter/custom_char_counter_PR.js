/*****************************************************************************************
 * NOME: custom_char_counter_PR.js
 * OBJETIVO: Contador numérico (Atual / Máximo) para campos de Texto e Textarea.
 * AUTOR: KENSLEY.LOPES | DATA: 11.mar.2026
 * 
 * --- INSTRUÇÕES DE USO ---
 * 1. No TOOLS: 
 *		- Localize o Control (campo) na Applet desejada.
 * 		- Adicione o marcador [#] ao final da Legenda (Label).
 *      Exemplo: "Descrição[#]".
 *
 * 2. MANIFESTO: Associe este arquivo como Physical Renderer da Applet.
 * 
 * O script detecta o marcador, extrai o limite do campo (maxlength), ativa o contador 
 * e limpa visualmente o [#] para o usuário final. Suporta Undo Record (Esc).
 *****************************************************************************************/

if(typeof(SiebelAppFacade.custom_char_counter_PR)==="undefined"){SiebelJS.Namespace("SiebelAppFacade.custom_char_counter_PR");define("siebel/custom/custom_char_counter_PR",["siebel/phyrenderer"],function(){SiebelAppFacade.custom_char_counter_PR=function(){var MARCADOR="[#]";function a(b){SiebelAppFacade.custom_char_counter_PR.superclass.constructor.apply(this,arguments)}SiebelJS.Extend(a,SiebelAppFacade.PhysicalRenderer);a.prototype.Init=function(){SiebelAppFacade.custom_char_counter_PR.superclass.Init.apply(this,arguments);this.AttachPMBinding("ExecuteUIUpdate",this.HandleCharCounters)};a.prototype.ShowUI=function(){SiebelAppFacade.custom_char_counter_PR.superclass.ShowUI.apply(this,arguments);this.HandleCharCounters()};a.prototype.BindData=function(){SiebelAppFacade.custom_char_counter_PR.superclass.BindData.apply(this,arguments);this.HandleCharCounters()};a.prototype.HandleCharCounters=function(){var b=this.GetPM(),c=b.Get("GetControls"),d=$("#"+b.Get("GetFullId"));for(var e in c){var f=c[e],g=f.GetDisplayName()||"";if(g.indexOf(MARCADOR)!==-1){var h=f.GetInputName(),i=d.find("[name='"+h+"']"),j=i.attr("maxlength"),k="cnt_"+h;if(i.length>0&&j){if($("#"+k).length===0){var l="font-size:12px; color:#9ba1a7; margin-top:2px; text-align:right; width:100%; clear:both;";i.after("<div id='"+k+"' style='"+l+"'></div>");i.off("input.cc").on("input.cc",function(){var m=$(this).val()?$(this).val().length:0,n=$(this).attr("maxlength");$("#cnt_"+$(this).attr("name")).text(m+" / "+n)})}var o=i.val()?i.val().length:0;$("#"+k).text(o+" / "+j)}d.find("label:contains('"+MARCADOR+"'), span:contains('"+MARCADOR+"'), div:contains('"+MARCADOR+"')").contents().filter(function(){return this.nodeType===3&&this.nodeValue.indexOf(MARCADOR)!==-1}).each(function(){this.nodeValue=this.nodeValue.replace(MARCADOR,"").trim()})}}};return a}();return"SiebelAppFacade.custom_char_counter_PR"})}
