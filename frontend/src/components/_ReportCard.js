// import React from 'react';

// const ReportCard = ({ 
//   title, 
//   value, 
//   subtitle, 
//   icon, 
//   import React from 'react';

//   const ReportCard = ({ 
//     title, 
//     value, 
//     subtitle, 
//     icon, 
//     trend, 
//     trendValue, 
//     color = "blue", 
//     size = "default",
//     onClick,
//     className = ""
//   }) => {
//     const colorClasses = {
//       blue: {
//         gradient: "from-blue-500 to-indigo-500",
//         bg: "bg-blue-50",
//         text: "text-blue-600",
//         border: "border-blue-200"
//       },
//       green: {
//         gradient: "from-green-500 to-emerald-500",
//         bg: "bg-green-50",
//         text: "text-green-600",
//         border: "border-green-200"
//       },
//       yellow: {
//         gradient: "from-yellow-500 to-orange-500",
//         bg: "bg-yellow-50",
//         text: "text-yellow-600",
//         border: "border-yellow-200"
//       },
//       red: {
//         gradient: "from-red-500 to-pink-500",
//         bg: "bg-red-50",
//         text: "text-red-600",
//         border: "border-red-200"
//       },
//       purple: {
//         gradient: "from-purple-500 to-indigo-500",
//         bg: "bg-purple-50",
//         text: "text-purple-600",
//         border: "border-purple-200"
//       },
//       teal: {
//         gradient: "from-teal-500 to-cyan-500",
//         bg: "bg-teal-50",
//         text: "text-teal-600",
//         border: "border-teal-200"
//       },
//       gray: {
//         gradient: "from-gray-500 to-gray-600",
//         bg: "bg-gray-50",
//         text: "text-gray-600",
//         border: "border-gray-200"
//       }
//     };

//     const sizeClasses = {
//       small: {
//         container: "p-4",
//         title: "text-sm",
//         value: "text-xl",
//         icon: "text-2xl",
//         subtitle: "text-xs"
//       },
//       default: {
//         container: "p-6",
//         title: "text-sm",
//         value: "text-2xl",
//         icon: "text-3xl",
//         subtitle: "text-xs"
//       },
//       large: {
//         container: "p-8",
//         title: "text-base",
//         value: "text-4xl",
//         icon: "text-4xl",
//         subtitle: "text-sm"
//       }
//     };

//     const colors = colorClasses[color];
//     const sizes = sizeClasses[size];

//     const getTrendIcon = () => {
//       if (trend === 'up') return '↑';
//       if (trend === 'down') return '↓';
//       if (trend === 'stable') return '→';
//       return '';
//     };

//     const getTrendColor = () => {
//       if (trend === 'up') return 'text-green-600 bg-green-50';
//       if (trend === 'down') return 'text-red-600 bg-red-50';
//       if (trend === 'stable') return 'text-gray-600 bg-gray-50';
//       return 'text-gray-600 bg-gray-50';
//     };

//     return (
//       <div 
//         className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${
//           onClick ? 'cursor-pointer hover:scale-105' : ''
//         } ${className}`}
//         onClick={onClick}
//       >
//         {/* Header with gradient */}
//         <div className={`bg-gradient-to-r ${colors.gradient} ${sizes.container}`}>
//           <div className="flex items-center justify-between">
//             <div className="flex-1">
//               <p className={`text-white ${sizes.title} font-medium opacity-90`}>
//                 {title}
//               </p>
//               <p className={`text-white ${sizes.value} font-bold leading-tight`}>
//                 {value}
//               </p>
//               {subtitle && (
//                 <p className={`text-white ${sizes.subtitle} opacity-80 mt-1`}>
//                   {subtitle}
//                 </p>
//               )}
//             </div>
//             {icon && (
//               <div className={`text-white ${sizes.icon} opacity-80 ml-4`}>
//                 {icon}
//               </div>
//             )}
//           </div>

//           {/* Trend indicator */}
//           {trend && trendValue && (
//             <div className="mt-3">
//               <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}>
//                 <span className="mr-1">{getTrendIcon()}</span>
//                 {trendValue}
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Optional bottom section */}
//         {(onClick || trend) && (
//           <div className={`${colors.bg} ${colors.border} border-t px-4 py-3`}>
//             {onClick ? (
//               <p className={`${colors.text} text-sm font-medium`}>
//                 Click to view details
//               </p>
//             ) : trend ? (
//               <p className="text-gray-600 text-xs">
//                 Compared to last period
//               </p>
//             ) : null}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Preset report card types for common use cases
//   export const StatCard = (props) => <ReportCard size="default" {...props} />;
//   export const MetricCard = (props) => <ReportCard size="large" {...props} />;
//   export const CompactCard = (props) => <ReportCard size="small" {...props} />;

//   // Quick stat card with icon
//   export const QuickStat = ({ title, value, icon, color = "blue" }) => (
//     <ReportCard
//       title={title}
//       value={value}
//       icon={icon}
//       color={color}
//       size="small"
//     />
//   );

//   // Trending card with automatic trend detection
//   export const TrendCard = ({ title, value, previousValue, icon, color = "blue" }) => {
//     const calculateTrend = () => {
//       if (!previousValue) return null;
    
//       const numValue = parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
//       const numPrevious = parseFloat(previousValue.toString().replace(/[^0-9.-]/g, ''));
    
//       if (numValue > numPrevious) {
//         const increase = ((numValue - numPrevious) / numPrevious * 100).toFixed(1);
//         return { trend: 'up', trendValue: `+${increase}%` };
//       } else if (numValue < numPrevious) {
//         const decrease = ((numPrevious - numValue) / numPrevious * 100).toFixed(1);
//         return { trend: 'down', trendValue: `-${decrease}%` };
//       } else {
//         return { trend: 'stable', trendValue: '0%' };
//       }
//     };

//     const trendData = calculateTrend();

//     return (
//       <ReportCard
//         title={title}
//         value={value}
//         icon={icon}
//         color={color}
//         trend={trendData?.trend}
//         trendValue={trendData?.trendValue}
//       />
//     );
//   };

//   export default ReportCard;