(function ( $ ) {

    /*
      Legacy code to transform an JQuery node into a json object
    */
    $.fn.serializeObject = function() {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
        if (o[this.name]) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
        } else {
          o[this.name] = this.value || '';
        }
      });
      return o;
    };

    /*
      Code to check if a string is empty (used on validation)
    */
    String.prototype.isEmpty = function() {
        return (this.length === 0 || !this.trim());
    };

    $.fn.ninjaform = function(options) {
        // Merging default settings with user custom options
        var settings = $.extend({
          'actionURL': 'https://www.rdstation.com.br/api/1.2/conversions',
          'namespace': 'ninjaform',
          'fields': [],
          'modal': false
        }, options);

        // Generate default fields
        var generateDefaultFields = function(){
          var resultHTML = [];
          var flashContainer = '<div class='+ settings.namespace +'-flash></div>';
          var formOpen = '<form action="' + settings.actionURL +'" class="' + settings.namespace + '-form">';
          var formClose = '</form>';
          var nameInput = '<input class="' + settings.namespace + '-input" name="name" type="text">';
          var emailInput = '<input class="' + settings.namespace + '-input" name="email" type="email">';
          var submitButton = '<button class="'+ settings.namespace +'-submit" type="submit">Enviar</button>'
          var customFields = [];
          for(key in options['fields']){
            var fieldArray = options['fields'][key];
            var field = '<select class="' + settings.namespace + '-select" name="' + key + '">';
            for(insideKey in fieldArray){
              field += '<option class="' + settings.namespace + '-option" value="' + fieldArray[insideKey] +'">' + fieldArray[insideKey] + '</option>';
            }
            field += "</select>";
            customFields.push(field);
          }
          // pushing elements into the result array
          resultHTML.push(flashContainer);
          resultHTML.push(formOpen);
          resultHTML.push(nameInput);
          resultHTML.push(emailInput);
          resultHTML.push(customFields.join(''));
          resultHTML.push(submitButton);
          resultHTML.push(formClose);

          // return the result string
          return resultHTML.join('');
        };

        // Handle default HTML generation
        var generateHTML = function(){
          /*
            Get the default fields and return it.
            
            This function was made in case we need to customize the default behavior without changing the modal behavior.
            In that case, concatenate the contents of generateDefaultFields() into the return of this function
            */
            return generateDefaultFields();
          };
        // Handle modal generation (requires bootstrap)
        var generateModal = function(){
          var resultHTML = [];
          var modalOpen = '<div id="'+ settings.namespace + '-modal" class="modal fade"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-body">';
          var modalClose = '</div> </div> </div> </div>';
          var form = generateDefaultFields();

          // pushing elements into the result array
          resultHTML.push(modalOpen);
          resultHTML.push(form);
          resultHTML.push(modalClose);

          // return the result string
          return resultHTML.join('');
        };

        var openModal = function(){
          // TODO open modal
          $('#' + settings.namespace + '-modal').modal();
        };

        var validateForm = function($form){
          var name = $form.find('input[name="name"]').val();
          var email = $form.find('input[name="name"]').val();
          if(name.isEmpty || email.isEmpty) return false;

          return true;
        };

        var initSubmitListener = function(){
          var submitSelector = '.' + settings.namespace + '-submit';
          console.log('[ninjaform] init submitlistener' + submitSelector);
          $(submitSelector).click(function(e){
            e.preventDefault();
            console.log('submitting');
            var $closestForm = $(this).closest('form');
            if(validateForm($closestForm)){
              submitForm($closestForm);
            }else{
              var $flashContainer = $closestForm.parent().find('.' + settings.namespace + '-flash');
              console.log('error on validation');
              console.log($flashContainer);
              $flashContainer.addClass('error');
              $flashContainer.text('Verifique os erros no formulário');
            }
            
          });
        };

        var submitForm = function($form){
          var leadData = $form.serializeObject();
          var $flashContainer = $form.parent().find('.' + settings.namespace + '-flash');
          console.log($flashContainer);
          $.post({
            'url': $form.attr('action'),
            'data': {
              'token_rdstation': settings.token,
              'secret': settings.secret,
              'name': leadData.name,
              'email': leadData.email
              // 'lead': leadData
            },
            'success': function(data){
              // TODO make success flash
              $flashContainer.addClass('success');
              $flashContainer.text('Formulário enviado com sucesso');
              console.log('success');
              console.log(data);
            },
            'error': function(jqXHR, textStatus, errorThrown){
              // TODO make error flash
              console.log('error');
              console.log(errorThrown);
              $flashContainer.addClass('error');
              $flashContainer.text('Erro ao enviar formulário');
            }
          });
        };

        // Plugin execution

        if(settings.modal === false){
          // Default behavior
          var result = this.each(function(){
            $(this).html(generateHTML());
          });
          initSubmitListener();
          return result;
        }else{
          // Modal behavior
          console.log('generating modal')
          var modalHTML = generateModal();
          $('body').append(modalHTML);
          initSubmitListener();
          return this.each(function(){
            $(this).click(function(e){
              e.preventDefault();
              openModal();
            });

          });
        }
        
      };

    }( jQuery ));