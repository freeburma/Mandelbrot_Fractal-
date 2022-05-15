class Coordinates
        {
            constructor(x, y)
            {
                this.x = x; 
                this.y = y; 
            }   
        }

        //// ========================== Define variables ==========================
        //// Circle values
        var radius = 300; 
        var point_size = 2; 
        var center_x = 400; 
        var center_y = 400; 
        var font_size = "20px"; 

        // let numOfDots; 
        //let equalDistanceDots; // Calculating equal space 
        let labelNameCount = 0; 

        let pointArray = []

        //// Canvas 
        var canvas = document.getElementById('myCanvas'); 
        var canvasContext = canvas.getContext("2d"); 

        //// ========================== Define variables ==========================

        
        //// Mouse click event to get the current cursor's coordinate (x, y) positions
        document.addEventListener("mousedown", function(e)
        {
            console.log(`clicked: [${e.x}, ${e.y}]`);
        });

        /**
            Drawing Circle. 
        */
        function DrawCircle()
        {
            canvasContext.beginPath(); 
            canvasContext.arc(center_x, center_y, radius, 0, 2 * Math.PI); 
            canvasContext.stroke()
        }// end drawCircle()

        /**
            drawPoint() will draw a point from "Circle" diameter. 
            angle: Double    : The direction of circle. Positive value: Clockwise, Negative value: Counter clockwise
            diameter: Double : The distance from center point to circumference 
            label: String    : Label name for dots. 
         */
        function drawPoint(angle, diameter, label)
        {
            /// -angle : will go anti-clockwise, positive will go clockwise
            var x = Math.floor(center_x + radius * Math.cos(-angle * Math.PI/180) * diameter);
            var y = Math.floor(center_y + radius * Math.sin(-angle * Math.PI/180) * diameter); 

            let localRadius = Math.floor(Math.min(canvas.width, canvas.height) / 2); 

            // console.log(`i: ${angle}, [x,y : ${x}, ${y}]`);

            // pointArray[index] = new Coordinates(x, y); 
            pointArray.push(new Coordinates(x, y)); 


            //// Drawing Dots on our circle circumference 
            canvasContext.beginPath(); 
            canvasContext.arc(x, y, point_size, 0, 2 * Math.PI); 
            canvasContext.fillStyle = "red"; 
            canvasContext.fill(); 


            /*
            The starting position is at 0deg. 
            Angle : + value clockwise 
            Angle : - value anti-clockwise 

                            90
                            |
                            |
                            |
               180 ------------------- 0/360
                            |
                            |
                            |
                            270
            **/
            
            //// Labels' x and y coordinates 
            var x2 = Math.floor(center_x + (radius + 20) * Math.cos(-angle * Math.PI/180) * diameter);
            var y2 = Math.floor(center_y + (radius + 20) * Math.sin(-angle * Math.PI/180) * diameter); 

            canvasContext.font = font_size; 
            canvasContext.fillText(label, x2, y2);

        }// end drawPoint()

        /**
            ConnectLinesByMultiplier method is an algorithm which will join dot to dot 
            according its calculated outcome. 
            multiplier: Double -> must increase by multiplier += 0.1 to see the result
            
        */
        function ConnectLinesByMultiplier(multiplier)
        {
            
            // console.log(pointArray); 

            for (let i = 1; i < pointArray.length; i++) 
            {
                let getNextPoint = (i * multiplier) % pointArray.length; 

                if (getNextPoint > 0)
                {
                    // console.log(`[${i} => ${getNextPoint}]`);
                
                    //// 0=10 in Array Index
                    // if (getNextPoint >= pointArray.length)
                    // {
                    //     getNextPoint -= pointArray.length ; 
                    //     // console.log(`[${i} = ${pointArray[i].x}, ${pointArray[i].y}] => [${getNextPoint} = ${pointArray[getNextPoint].x}, ${pointArray[getNextPoint].y}]`);

                    // }
                    

                
                    canvasContext.beginPath(); 
                    canvasContext.moveTo(pointArray[i].x, pointArray[i].y ); 
                    canvasContext.lineTo(pointArray[getNextPoint].x, pointArray[getNextPoint].y ); 
                    canvasContext.stroke();
                    canvasContext.restore()
                

                }// end if 

                
            }// end for


            //// Testing codes before we get it from For Loop. 
            // ctx.beginPath(); 

            // ctx.moveTo(pointArray[0].x, pointArray[0].y ); 
            // ctx.lineTo(pointArray[1].x, pointArray[1].y); 
            // ctx.stroke();
            
            // ctx.moveTo(pointArray[1].x, pointArray[1].y ); 
            // ctx.lineTo(pointArray[2].x, pointArray[2].y); 
            // ctx.stroke();

           
            

        }// end ConnectLinesByMultiplier()

        //// Execution
    
        // drawPoint(0, 1, "A"); 
        // drawPoint(90, 1.5, "B"); 
        // drawPoint(180, 1, "C"); 
        // drawPoint(45, 0.5, "D"); 

        
        //// Drawing points around circle's circumference with equal space. 
        function DrawDots(numOfDots)
        {
            let equalDistanceDots = 360 / numOfDots

            for (let i = 0; i < 360; i+= equalDistanceDots)
            {
                drawPoint(i, 1, `${ labelNameCount }`); 
                labelNameCount ++; 


            }// end for 
        }// end DrawDots()

        /// Extending the array function to empty its items. 
        Array.prototype.clear = function() {
            this.splice(0, this.length);
        };

        function ResetCanvasAndVariables()
        {
            canvasContext.clearRect(0, 0, canvas.width, canvas.height); // Clearing canvas

            labelNameCount = 0; 
            pointArray.clear();  // Custom clear extension. 
            pointArray= []; 
            

        }

        //// Drawing the Default Fractal - Heart Shape
        // initial(40); 
        DrawCircle(); 
        DrawDots(200)
        ConnectLinesByMultiplier(2); // Connecting dots by multiplier 

        let automateFractalTimer; 

        function DrawFractal(isAutomate=false)
        {
            ResetCanvasAndVariables(); 


            let numDotsID = document.querySelector('#numOfDots_Id'); 
            let numDots = numDotsID.value; 
            if (numDots <= 0 )
            {

                //// Try with the following comments 
                // numDots = 1000; // is very interesting
                // numDots = 500; 
                numDots = 400; 
            }

            let multiplierID = document.querySelector('#multiplier_Id'); 
            let multiplier = multiplierID.value; 

            if (multiplier == null)
            {
                multiplier = 0; 
            }

            DrawCircle(); 
            DrawDots(numDots);



            if (isAutomate)
            {
                automateFractalTimer = setInterval(() => 
                {
                    ResetCanvasAndVariables(); 

                    multiplier ++; 

                    DrawCircle(); 
                    DrawDots(numDots);
                    ConnectLinesByMultiplier(multiplier); // Connecting dots by multiplier 


                    console.log(`Multiplier: ${multiplier}`);
                    
                    //// Resetting multipliers
                    if (multiplier == 100)
                    {
                        multiplier = 0; 
                    }
                }, 1000); 
        
            }
            else
            {

                console.log(`Form: ${numDots}, ${multiplier}`);
                CancelTimer(); 

                ConnectLinesByMultiplier(multiplier); // Connecting dots by multiplier 
            }// end if -> isAutomate


            numDotsID.value = ''; 
            multiplierID.value = ''; 

            numDotsID.focus(); 

        }// end DrawFractal() 

        function CancelTimer() 
        {
            clearInterval(automateFractalTimer); 
        }// end CancelTimer()


