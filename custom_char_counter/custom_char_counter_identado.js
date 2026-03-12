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

if (typeof(SiebelAppFacade.custom_char_counter_PR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.custom_char_counter_PR");
    define("siebel/custom/custom_char_counter_PR", ["siebel/phyrenderer"], function () {
        SiebelAppFacade.custom_char_counter_PR = (function () {

            // --- CUSTOMIZAÇÃO: Marcador utilizado no Tools ---
            var MARCADOR = "[#]"; 

            function custom_char_counter_PR(pm) {
                SiebelAppFacade.custom_char_counter_PR.superclass.constructor.apply(this, arguments);
            }

            SiebelJS.Extend(custom_char_counter_PR, SiebelAppFacade.PhysicalRenderer);

            custom_char_counter_PR.prototype.Init = function () {
                SiebelAppFacade.custom_char_counter_PR.superclass.Init.apply(this, arguments);
                // Monitora atualizações de UI (Essencial para Desfazer Registro / Undo)
                this.AttachPMBinding("ExecuteUIUpdate", this.HandleCharCounters);
            };

            custom_char_counter_PR.prototype.ShowUI = function () {
                SiebelAppFacade.custom_char_counter_PR.superclass.ShowUI.apply(this, arguments);
                this.HandleCharCounters();
            };

            custom_char_counter_PR.prototype.BindData = function () {
                SiebelAppFacade.custom_char_counter_PR.superclass.BindData.apply(this, arguments);
                this.HandleCharCounters();
            };

            custom_char_counter_PR.prototype.HandleCharCounters = function () {
                var pm = this.GetPM();
                var controls = pm.Get("GetControls");
                var $applet = $("#" + pm.Get("GetFullId"));

                for (var cn in controls) {
                    var ctrl = controls[cn];
                    var labelText = ctrl.GetDisplayName() || "";

                    // Identifica campos marcados com o gatilho
                    if (labelText.indexOf(MARCADOR) !== -1) {
                        var inputName = ctrl.GetInputName();
                        var $field = $applet.find("[name='" + inputName + "']");
                        var maxLen = $field.attr("maxlength");
                        var counterId = "cnt_" + inputName;

                        if ($field.length > 0 && maxLen) {
                            // Criação do elemento visual caso não exista
                            if ($("#" + counterId).length === 0) {
                                
                                // --- CUSTOMIZAÇÃO: Cores, Tamanho e Alinhamento ---
                                // color: cor da fonte | font-size: tamanho | text-align: posição (left/right)
                                var style = "font-size:12px; color:#9ba1a7; margin-top:2px; text-align:right; width:100%; clear:both;";
                                $field.after("<div id='" + counterId + "' style='" + style + "'></div>");
                                
                                // Evento de digitação manual
                                $field.off("input.cc").on("input.cc", function() {
                                    var curr = $(this).val() ? $(this).val().length : 0;
                                    var limit = $(this).attr("maxlength");
                                    // --- CUSTOMIZAÇÃO: Texto exibido no contador ---
                                    $("#cnt_" + $(this).attr("name")).text(curr + " / " + limit);
                                });
                            }
                            
                            // Sincronização de valores (Leitura do DOM pós-navegação ou Undo)
                            var currentVal = $field.val() ? $field.val().length : 0;
                            $("#" + counterId).text(currentVal + " / " + maxLen);
                        }

                        // Limpeza visual: Remove o marcador [#] do Label preservando ícones nativos
                        $applet.find("label:contains('" + MARCADOR + "'), span:contains('" + MARCADOR + "'), div:contains('" + MARCADOR + "')")
                        .contents().filter(function() {
                            return this.nodeType === 3 && this.nodeValue.indexOf(MARCADOR) !== -1;
                        }).each(function() {
                            this.nodeValue = this.nodeValue.replace(MARCADOR, "").trim();
                        });
                    }
                }
            };

            return custom_char_counter_PR;
        }());
        return "SiebelAppFacade.custom_char_counter_PR";
    });
}
