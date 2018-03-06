
	"use strict";
    
        function sortTable() {
      var table, rows, switching, i, x, y, shouldSwitch;
      table = document.getElementById("nt");
      switching = true;
      /* Make a loop that will continue until
      no switching has been done: */
      while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
          // Start by saying there should be no switching:
          shouldSwitch = false;
          /* Get the two elements you want to compare,
          one from current row and one from the next: */
          x = rows[i].getElementsByTagName("TD")[0];
          y = rows[i + 1].getElementsByTagName("TD")[0];
          // Check if the two rows should switch place:
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // I so, mark as a switch and break the loop:
            shouldSwitch= true;
            break;
          }
        }
        if (shouldSwitch) {
          /* If a switch has been marked, make the switch
          and mark that a switch has been done: */
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
        }
      }
    }
    
    let ui = {
        autoSelect: document.getElementById("auto-select")
    };
    
        $(document).ready(function(){
            // sets a function that will be called when the websocket connects/disconnects
            NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);
            // sets a function that will be called when the robot connects/disconnects
            NetworkTables.addRobotConnectionListener(onRobotConnection, true);
            // sets a function that will be called when any NetworkTables key/value changes
            NetworkTables.addGlobalListener(onValueChanged, true);
        });
        function onRobotConnection(connected) {
            if(connected){
                $('#robotAddress').text(NetworkTables.getRobotAddress());
                $(".robot-box").css("background-color", "green");
                $(".ip-box").css("background-color", "green");
                $('#robotstate').text("Connected!");
            } else {
                $(".robot-box").css("background-color", "red");
                $(".ip-box").css("background-color", "red");
                $('#robotstate').text("DISABLED AAHHAAHFHASDHFDAHFDHASHF!");
                $('#robotAddress').text("Darn! There is no robot! Oh my! 404 Robot not found! oops!");
            }
    
        }
        function onNetworkTablesConnection(connected) {
            if (connected) {
                $("#connectstate").text("Connected!");
                $(".network-box").css("background-color", "green");
                // Load list of prewritten autonomous modes
    NetworkTables.addKeyListener('/SmartDashboard/auto_options', (key, value) => {
        // Clear previous list
        while (ui.autoSelect.firstChild) {
                ui.autoSelect.removeChild(ui.autoSelect.firstChild);
        }
        // Make an option for each autonomous mode and put it in the selector
        for (let i = 0; i < value.length; i++) {
                var option = document.createElement('option');
                option.appendChild(document.createTextNode(value[i]));
                ui.autoSelect.appendChild(option);
        }
        // Set value to the already-selected mode. If there is none, nothing will happen.
        ui.autoSelect.value = NetworkTables.getValue('/SmartDashboard/selected_auto_mode');});
    
    // Load list of prewritten autonomous modes
    NetworkTables.addKeyListener('/SmartDashboard/autonomous/selected', (key, value) => {
        ui.autoSelect.value = value;
    });
                // clear the table
                $("#nt tbody > tr").remove();
            } else {
                $("#connectstate").text("Disconnected!");
                $(".robot-box").css("background-color", "red");
                $(".ip-box").css("background-color", "red");
                $(".network-box").css("background-color", "red");
            }
            
        }
        function onValueChanged(key, value, isNew) {
            //Here we will put things that will always be changed in the webpage
            var angleOfRobot = 90 + -Number(NetworkTables.getValue("/getYaw"));
    
            var pixelX = NetworkTables.getValue("/robotX") * 900;
            pixelX = pixelX / 8.12;
            pixelX = 450 + pixelX;
    
            var pixelY = Number(NetworkTables.getValue("/robotY")) * 469;
            pixelY = pixelY /16.4592;
            pixelY = 5 + pixelY
            $("#selectAuto").text(NetworkTables.getValue("/SmartDashboard/selected_auto_mode"));
            $('.robot').css('transform','rotate(' + angleOfRobot + 'deg');
            $(".robot").css("top", pixelX);
            $(".robot").css("left", pixelY);

            $(document).on('change', '#auto-select', function(e) {
                if(NetworkTables.getValue("/SmartDashboard/selected_auto_mode") == this.options[e.target.selectedIndex].text )  {
                  //  console.log("gucci" + "  " +NetworkTables.getValue("/SmartDashboard/selected_auto_mode").value + " "+this.options[e.target.selectedIndex].text);
                    
                }   
//                console.log("nop" + "  " +NetworkTables.getValue("/SmartDashboard/selected_auto_mode")+ " "+this.options[e.target.selectedIndex].text);                
            });
            // key thing here: we're using the various NetworkTable keys as
            // the id of the elements that we're appending, for simplicity. However,
            // the key names aren't always valid HTML identifiers, so we use
            // the NetworkTables.keyToId() function to convert them appropriately
            if (isNew) {
                
                var tr = $('<tr></tr>').appendTo($('#nt > tbody:last'));
                $('<td></td>').text(key).appendTo(tr);
                $('<td></td>').attr('id', NetworkTables.keyToId(key))
                               .text(value)
                               .appendTo(tr);
            } else {
                // similarly, use keySelector to convert the key to a valid jQuery
                // selector. This should work for class names also, not just for ids
                $('#' + NetworkTables.keySelector(key)).text(value);
            }
        }
    // Load list of prewritten autonomous modes
    NetworkTables.addKeyListener('/SmartDashboard/auto_options', (key, value) => {
        // Clear previous list
        while (ui.autoSelect.firstChild) {
                ui.autoSelect.removeChild(ui.autoSelect.firstChild);
        }
        // Make an option for each autonomous mode and put it in the selector
        for (let i = 0; i < value.length; i++) {
                var option = document.createElement('option');
                option.appendChild(document.createTextNode(value[i]));
                ui.autoSelect.appendChild(option);
        }
        // Set value to the already-selected mode. If there is none, nothing will happen.
        ui.autoSelect.value = NetworkTables.getValue('/SmartDashboard/selected_auto_mode');});
    
    
    // Update NetworkTables when autonomous selector is changed
    ui.autoSelect.onchange = function() {
        NetworkTables.putValue('/SmartDashboard/selected_auto_mode', this.value);
    };
    

        function sendCmd(cmd) {
            $.ajax({
                url: cmd,
                success: function( data ) {
                    alert("Completed SSH Request");
                },
                error: function () {
                    alert("You have done goofed Chris")
                }
            });
        }
    